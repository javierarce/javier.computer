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
      if ENV["JEKYLL_ENV"] == "production"
        generate_places(site)
      end
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

    def get_place_last_updated(location_data)
      # Priority order: updated_at > date > fallback to a default
      updated_at = parse_date(location_data['updated_at'])
      return updated_at if updated_at

      frontmatter_date = parse_date(location_data['date'])
      return frontmatter_date if frontmatter_date

      # Fallback to a reasonable default date
      DateTime.new(2023, 1, 1)
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
        location_data['last_updated'] = get_place_last_updated(location_data)
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

      # Sort places by last_updated date (most recent first)
      locations_hash.each do |location_name, places|
        locations_hash[location_name] = places.sort_by do |place|
          place['last_updated'].to_time.to_i
        end.reverse
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
              end
            end
          end
        end
      end

      generate_json(locations_hash)
      generate_rss(site, locations_hash)
      generate_csv(locations_hash)
    end

    def generate_csv(locations_hash)
      # Ensure the directory exists
      FileUtils.mkdir_p("assets/maps")
      
      locations_hash.each do |location, places|
        CSV.open("assets/maps/#{location}.csv", "w") do |csv|
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
      end
    end

    private

    def generate_json(locations_hash)
      # Ensure the directory exists
      FileUtils.mkdir_p("_data/locations")
      
      locations_hash.each do |location, data|
        json_file_path = "_data/locations/#{location}.json"

        # Only write if data has changed
        if File.exist?(json_file_path)
          begin
            current_data = JSON.parse(File.read(json_file_path))
            next if current_data == data
          rescue JSON::ParserError
            puts "Warning: Could not parse existing JSON file #{json_file_path}"
          end
        end

        File.open(json_file_path, 'w') do |file|
          file.write(JSON.pretty_generate(data.uniq { |d| d['pid'] }))
        end

        puts "Generated JSON for #{location} (#{data.length} places)"
      end
    end

    def generate_rss(site, locations_hash)
      feeds_dir = File.join(site.config['source'], 'feeds')
      FileUtils.mkdir_p(feeds_dir)

      locations_hash.each do |location, points_of_interest|
        # Points are already sorted by last_updated (most recent first)
        
        # Get the most recent update date for the channel
        most_recent_update = points_of_interest.first&.dig('last_updated') || DateTime.new(2023, 1, 1)

        rss = RSS::Maker.make("2.0") do |maker|
          maker.channel.title = "Feed de lugares de #{location.capitalize}"
          maker.channel.link = "#{site.config['url']}/feeds/#{location}.rss"
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

        rss_file_path = File.join(feeds_dir, "#{location}.rss")

        # Only write if content has changed
        if File.exist?(rss_file_path)
          current_content = File.read(rss_file_path).strip
          new_content = rss.to_s.strip
          next if current_content == new_content
        end

        File.write(rss_file_path, rss.to_s)
        puts "Generated RSS feed for #{location} (#{points_of_interest.length} items)"
      end
    end
  end
end
