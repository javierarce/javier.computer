require 'rss'
require 'json'
require 'yaml'
require 'csv'
require 'fileutils'
require 'kramdown'

module Jekyll
  class LocationFileGenerator < Generator
    safe true
    priority :lowest

    def generate(site)
      generate_places(site)
      generate_geotagged_posts(site)
    end

    def strip_html_tags(text)
      return '' if text.nil?
      text.gsub(/<\/?[^>]*>/, "")
    end

    def render_markdown(text)
      return '' if text.nil?
      Kramdown::Document.new(text).to_html
    end

    def parse_date(date_string)
      return nil if date_string.nil?
      
      case date_string
      when String
        DateTime.parse(date_string) rescue nil
      when DateTime
        date_string
      when Date
        date_string.to_datetime
      when Time
        date_string.to_datetime
      else
        nil
      end
    end

    def get_file_first_commit_date(file)
      date_str = `git log --diff-filter=A --format=%aI -- #{file}`.strip
      parse_date(date_str)
    end

    def get_place_last_updated(location_data, file = nil)
      # Priority order: updated_at > date > git first-commit date > fallback
      updated_at = parse_date(location_data['updated_at'])
      return updated_at if updated_at

      frontmatter_date = parse_date(location_data['date'])
      return frontmatter_date if frontmatter_date

      if file
        git_date = get_file_first_commit_date(file)
        return git_date if git_date
      end

      # Fallback for uncommitted files — use file mtime for deterministic output
      if file && File.exist?(file)
        File.mtime(file).to_datetime
      else
        DateTime.new(2023, 1, 1)
      end
    end

    def generate_places(site)
      pid_hash = {}

      puts "Generating places..."

      Dir.glob('content/_places/*.md').each do |file|
        content = File.read(file)
        front_matter_match = content.match(/---(.*)---/m)
        
        unless front_matter_match
          puts "Warning: No front matter found in #{file}"
          next
        end

        begin
          location_data = YAML.load(front_matter_match[1])
        rescue => e
          puts "Error parsing YAML in #{file}: #{e.message}"
          next
        end

        next if location_data.nil? || location_data['pid'].nil?

        # Use the new date parsing method
        location_data['last_updated'] = get_place_last_updated(location_data, file)
        location_data['description'] = render_markdown(location_data['description'])
        location_data['post_references'] ||= []
        
        # Keep original frontmatter_date for backward compatibility
        location_data['frontmatter_date'] = location_data['date'] if location_data['date']
        
        pid_hash[location_data['pid']] = location_data
      end

      locations_hash = {}

      pid_hash.each_value do |place_details|
        location_name = place_details['location'] || 'unknown'
        locations_hash[location_name] ||= []
        
        # Avoid duplicates
        unless locations_hash[location_name].any? { |ld| ld['pid'] == place_details['pid'] }
          locations_hash[location_name] << place_details
        end
      end

      # Process post locations
      site.posts.docs.each do |post|
        if post.data['places']
          post.data['places'].each do |place_pid|
            if pid_hash[place_pid]
              post_ref = {
                'url' => post.url,
                'title' => post.data['title'],
                'date' => post.data['date'].to_s
              }

              location_name = pid_hash[place_pid]['location'] || 'unknown'
              place_details = locations_hash[location_name].find { |ld| ld['pid'] == place_pid }

              if place_details
                # Avoid duplicate post references
                unless place_details['post_references'].any? { |pr| pr['url'] == post_ref['url'] }
                  place_details['post_references'] << post_ref
                end

                # Update last_updated if this post is newer — so the place
                # resurfaces in the feed with the new post as context
                post_date = parse_date(post.data['date'])
                if post_date && post_date > place_details['last_updated']
                  place_details['last_updated'] = post_date
                end
              end
            end
          end
        end
      end

      # Sort after processing post references, since a new post can update
      # a place's effective date. Sorted most recent first, pid as tiebreaker.
      locations_hash.each do |location_name, places|
        locations_hash[location_name] = places.sort_by do |place|
          [-place['last_updated'].to_time.to_i, place['pid'].to_s]
        end
      end

      generate_json(locations_hash)

      # Update site.data so templates use the freshly computed locations
      # (Jekyll loads _data/ files before generators run, so the JSON on
      # disk alone isn't enough for the current build)
      site.data['locations'] ||= {}
      locations_hash.each do |location_name, places|
        site.data['locations'][location_name] = places
      end

      # RSS and CSV only in production — they contain absolute URLs from site.config
      # and don't feed back into the build, so generating them in dev would just
      # trigger unnecessary rebuild loops
      if ENV["JEKYLL_ENV"] == "production"
        generate_rss(site, locations_hash)
        generate_csv(locations_hash)
      end
    end

    def generate_geotagged_posts(site)
      puts "Generating geotagged posts..."

      # Group posts by location, then by latlng
      posts_by_location = {}

      site.posts.docs.each do |post|
        next unless post.data['latlng'] && post.data['location']

        latlng = post.data['latlng']
        location_name = post.data['location']

        posts_by_location[location_name] ||= {}

        # Use latlng as a key to group posts at the same coordinates
        coord_key = "#{latlng[0]},#{latlng[1]}"
        posts_by_location[location_name][coord_key] ||= {
          'latlng' => latlng,
          'posts' => []
        }

        posts_by_location[location_name][coord_key]['posts'] << {
          'url' => post.url,
          'title' => post.data['title'],
          'date' => post.data['date'].to_s
        }
      end

      # Sort posts within each group (newest first)
      posts_by_location.each do |location_name, coord_groups|
        coord_groups.each do |coord_key, group|
          group['posts'].sort_by! { |p| p['date'] }.reverse!
        end
      end

      # Generate JSON files, removing stale ones
      FileUtils.mkdir_p("_data/geotagged_posts")

      Dir.glob("_data/geotagged_posts/*.json").each do |existing_file|
        location_name = File.basename(existing_file, ".json")
        unless posts_by_location.key?(location_name)
          File.delete(existing_file)
          puts "Removed stale geotagged posts JSON for #{location_name}"
        end
      end

      posts_by_location.each do |location_name, coord_groups|
        data = coord_groups.values
        json_file_path = "_data/geotagged_posts/#{location_name}.json"
        new_content = JSON.pretty_generate(data)

        if File.exist?(json_file_path)
          begin
            current_content = File.read(json_file_path).strip
            next if current_content == new_content.strip
          rescue => e
            puts "Warning: Could not read existing file #{json_file_path}: #{e.message}"
          end
        end

        File.open(json_file_path, 'w') do |file|
          file.write(new_content)
        end

        puts "Generated geotagged posts JSON for #{location_name} (#{data.length} locations)"
      end

      # Store in site.data for templates
      site.data['geotagged_posts'] ||= {}
      posts_by_location.each do |location_name, coord_groups|
        site.data['geotagged_posts'][location_name] = coord_groups.values
      end

    end

    def generate_csv(locations_hash)
      # Ensure the directory exists
      FileUtils.mkdir_p("assets/maps")

      locations_hash.each do |location, places|
        csv_file_path = "assets/maps/#{location}.csv"
        new_content = CSV.generate do |csv|
          csv << ["name", "description", "address", "latitude", "longitude", "updated_at"]

          places.each do |place|
            name = place["title"]
            description = strip_html_tags(place["description"] || "")
            address = place["address"]
            lat = place["latlng"]&.first
            lng = place["latlng"]&.last
            updated_at = place["updated_at"] || place["date"]

            csv << [name, description, address, lat, lng, updated_at]
          end
        end

        # Only write if content has changed
        if File.exist?(csv_file_path)
          next if File.read(csv_file_path) == new_content
        end

        File.write(csv_file_path, new_content)
        puts "Generated CSV for #{location} (#{places.length} places)"
      end
    end

    private

    def generate_json(locations_hash)
      # Ensure the directory exists
      FileUtils.mkdir_p("_data/locations")

      locations_hash.each do |location, data|
        json_file_path = "_data/locations/#{location}.json"
        new_content = JSON.pretty_generate(data.uniq { |d| d['pid'] })

        # Only write if data has changed
        if File.exist?(json_file_path)
          begin
            current_content = File.read(json_file_path).strip
            next if current_content == new_content.strip
          rescue => e
            puts "Warning: Could not read existing file #{json_file_path}: #{e.message}"
          end
        end

        File.open(json_file_path, 'w') do |file|
          file.write(new_content)
        end

        puts "Generated JSON for #{location} (#{data.length} places)"
      end
    end

    def generate_rss(site, locations_hash)
      feeds_dir = File.join(site.config['source'], 'feeds')
      FileUtils.mkdir_p(feeds_dir)

      # Build a map from location slug to display title (e.g. "newyork" => "Nueva York")
      location_titles = {}
      if site.collections['maps']
        site.collections['maps'].docs.each do |map_doc|
          slug = map_doc.data['location']
          location_titles[slug] = map_doc.data['title'] if slug
        end
      end

      locations_hash.each do |location, points_of_interest|
        # Points are already sorted by last_updated (most recent first)
        points_of_interest = points_of_interest.first(20)

        # Get the most recent update date for the channel
        most_recent_update = points_of_interest.first&.dig('last_updated') || DateTime.new(2023, 1, 1)

        rss = RSS::Maker.make("2.0") do |maker|
          maker.channel.title = "Feed de lugares de #{location.capitalize}"
          maker.channel.link = "#{site.config['url']}/feeds/#{location}.xml"
          maker.channel.language = "es"
          maker.channel.description = "Sitios en #{location}"
          maker.channel.updated = most_recent_update.iso8601

          points_of_interest.each do |point|
            maker.items.new_item do |item|
              item.link = "#{site.config['url']}/maps/#{location}/#{point['pid']}"
              item.title = point['title'] || 'Sin título'

              # Build description with post references
              description_parts = []
              
              if point['description']
                description_parts << point['description']
              end
              
              if point['address']
                description_parts << "<br><strong>Dirección:</strong> <a href='#{item.link}'>#{point['address']}</a>"
              end

              if point['post_references'] && !point['post_references'].empty?
                description_parts << "<br><br><strong>Aparece en estos posts:</strong>"
                description_parts << "<ul>"
                point['post_references'].each do |post_ref|
                  description_parts << "<li><a href='#{site.config['url']}#{post_ref['url']}'>#{post_ref['title']}</a></li>"
                end
                description_parts << "</ul>"
              end

              item.description = description_parts.join
              item.updated = point['last_updated'].iso8601
              item.dc_subject = location
            end
          end
        end

        rss_file_path = File.join(feeds_dir, "#{location}.xml")

        rss_content = rss.to_s.encode('UTF-8')
          .sub('?>', "?>\n<?xml-stylesheet href=\"/feed-places.xsl\" type=\"text/xsl\"?>")

        # Only write if content has changed
        if File.exist?(rss_file_path)
          current_content = File.read(rss_file_path, encoding: 'UTF-8').strip
          next if current_content == rss_content.strip
        end

        File.write(rss_file_path, rss_content, encoding: 'UTF-8')
        puts "Generated RSS feed for #{location} (#{points_of_interest.length} items)"
      end

      # Generate combined feed with all places from all cities
      all_places = locations_hash.values.flatten.sort_by do |place|
        [-place['last_updated'].to_time.to_i, place['pid'].to_s]
      end.first(20)

      most_recent = all_places.first&.dig('last_updated') || DateTime.new(2023, 1, 1)

      rss = RSS::Maker.make("2.0") do |maker|
        maker.channel.title = "Feed de lugares"
        maker.channel.link = "#{site.config['url']}/feeds/places.xml"
        maker.channel.language = "es"
        maker.channel.description = "Todos los sitios"
        maker.channel.updated = most_recent.iso8601

        all_places.each do |point|
          location = point['location'] || 'unknown'

          maker.items.new_item do |item|
            item.link = "#{site.config['url']}/maps/#{location}/#{point['pid']}"
            item.title = point['title'] || 'Sin título'

            description_parts = []

            if point['description']
              description_parts << point['description']
            end

            if point['address']
              address_text = point['address']
              city_name = location_titles[location] || location&.capitalize
              address_text = "#{address_text}, #{city_name}" if city_name && location != 'unknown'
              description_parts << "<br><strong>Dirección:</strong> <a href='#{item.link}'>#{address_text}</a>"
            end

            if point['post_references'] && !point['post_references'].empty?
              description_parts << "<br><br><strong>Aparece en estos posts:</strong>"
              description_parts << "<ul>"
              point['post_references'].each do |post_ref|
                description_parts << "<li><a href='#{site.config['url']}#{post_ref['url']}'>#{post_ref['title']}</a></li>"
              end
              description_parts << "</ul>"
            end

            item.description = description_parts.join
            item.updated = point['last_updated'].iso8601
            item.dc_subject = location
          end
        end
      end

      rss_file_path = File.join(feeds_dir, "places.xml")
      rss_content = rss.to_s.encode('UTF-8')
        .sub('?>', "?>\n<?xml-stylesheet href=\"/feed-places.xsl\" type=\"text/xsl\"?>")

      write_needed = true
      if File.exist?(rss_file_path)
        current_content = File.read(rss_file_path, encoding: 'UTF-8').strip
        write_needed = current_content != rss_content.strip
      end

      if write_needed
        File.write(rss_file_path, rss_content, encoding: 'UTF-8')
        puts "Generated combined RSS feed (#{all_places.length} items)"
      end
    end
  end
end
