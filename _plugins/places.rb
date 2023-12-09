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
      generate_rss(site)
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

    def generate_rss(site)
      data_dir = site.config['data_dir'] || '_data'
      site_dir = site.config['source']
      feeds_dir = File.join(site_dir, 'feeds')
      FileUtils.mkdir_p(feeds_dir)

      Dir.glob(File.join(site_dir, data_dir, "locations/*.json")).each do |location_file|
        next if File.basename(location_file) =~ /_base\.json\z/

        location = File.basename(location_file, '.json')
        points_of_interest = JSON.parse(File.read(location_file))

        most_recent_post_date = site.time
        puts "Generating RSS feed for #{location} #{most_recent_post_date}"

        rss = RSS::Maker.make("2.0") do |maker|
          maker.channel.title = "RSS feed de #{location}"
          maker.channel.link = "#{site.config['url']}/feeds/#{location}.rss"
          maker.channel.description = "Sitios en #{location}"

          points_of_interest.each do |point|
            maker.items.new_item do |item|
              item.link = "#{site.config['url']}/maps/#{location}"
              item.title = "#{point['title']}"

              references = []

              if point['post_references']
                references << "<ul>"
                references.concat(point['post_references'].map { |post_ref|
                  post_date = post_ref['date']

                  if post_date
                    post_date = DateTime.parse(post_date) if post_date.is_a?(String)
                    most_recent_post_date = post_date 
                  end

                  "<li><a href='#{site.config['url']}#{post_ref['url']}'>#{post_ref['title']}</a></li>"
                })
                references << "</ul>"
              end

              description = "#{point['description']}<br><br>#{point['address']}<br><br>#{references.join}"
              item.description = description
              item.updated = most_recent_post_date.iso8601
              item.dc_subject = location
            end
          end

          maker.channel.updated = most_recent_post_date.iso8601
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
