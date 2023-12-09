require 'rss'
require 'json'
require 'yaml'

module Jekyll
  class LocationFileGenerator < Generator
    safe true
    priority :lowest

    def generate(site)
      pid_hash = {}

      # Load location data from individual files in _content/_places/
      Dir.glob('content/_places/*.md').each do |file|
        content = File.read(file)
        front_matter = content.match(/---(.*)---/m)[1]
        location_data = YAML.load(front_matter)

        next if location_data.nil? || location_data['pid'].nil?

        location_data['post_references'] ||= []
        location_data['frontmatter_date'] = location_data['date'] if location_data['date']
        pid_hash[location_data['pid']] = location_data
      end

      locations_hash = {}

      pid_hash.each_value do |place_details|
        location_name = place_details['location'] || 'unknown'
        locations_hash[location_name] ||= []
        locations_hash[location_name] << place_details unless locations_hash[location_name].any? { |ld| ld['pid'] == place_details['pid'] }
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
              place_details['post_references'] << post_ref unless place_details['post_references'].any? { |pr| pr['url'] == post_ref['url'] }
            end
          end
        end
      end

      generate_json(locations_hash)
      generate_rss(site, locations_hash)
    end

    private

    def generate_json(locations_hash)
      locations_hash.each do |location, data|
        json_file_path = "_data/locations/#{location}.json"

        if File.exists?(json_file_path)
          current_data = JSON.parse(File.read(json_file_path))
          next if current_data == data
        end

        File.open(json_file_path, 'w') do |file|
          file.write(JSON.pretty_generate(data.uniq { |d| d['pid'] }))
        end
      end
    end

    def generate_rss(site, locations_hash)
      data_dir = site.config['data_dir'] || '_data'
      site_dir = site.config['source']
      feeds_dir = File.join(site_dir, 'feeds')
      FileUtils.mkdir_p(feeds_dir)

      locations_hash.each do |location, points_of_interest|
        most_recent_date = site.time.to_datetime # Convert to DateTime for comparison

        rss = RSS::Maker.make("2.0") do |maker|
          maker.channel.title = "RSS feed de #{location}"
          maker.channel.link = "#{site.config['url']}/feeds/#{location}.rss"
          maker.channel.description = "Sitios en #{location}"

          points_of_interest.each do |point|
            post_dates = point['post_references'].map do |post_ref|
              DateTime.parse(post_ref['date']) if post_ref['date']
            end.compact

            most_recent_post_date = post_dates.max
            frontmatter_date = DateTime.parse(point['date']) if point['date']
            puts "Frontmatter date: #{frontmatter_date} from #{point['title']}"
            point_date = [most_recent_post_date, frontmatter_date].compact.max
            most_recent_date = [most_recent_date, point_date].compact.max

            maker.items.new_item do |item|
              item.link = "#{site.config['url']}/maps/#{location}/#{point['pid']}"
              item.title = "#{point['title']}"

              references = []
              if point['post_references']
                references << "<ul>"
                references.concat(point['post_references'].map { |post_ref|
                  "<li><a href='#{site.config['url']}#{post_ref['url']}'>#{post_ref['title']}</a></li>"
                })
                references << "</ul>"
              end

              description = "#{point['description']}<br><br>#{point['address']}<br><br>#{references.join}"
              item.description = description
              item.updated = point_date.iso8601 if point_date
              item.dc_subject = location
            end
          end

          maker.channel.updated = most_recent_date.iso8601
        end

        rss_file_path = File.join(feeds_dir, "#{location}.rss")

        if File.exists?(rss_file_path)
          current_data = File.read(rss_file_path)
          next if current_data == rss.to_s
        end

        File.write(rss_file_path, rss.to_s)
      end
    end
  end
end
