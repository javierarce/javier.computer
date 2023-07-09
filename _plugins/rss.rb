require 'rss'

module Jekyll
  class GenerateRSS < Generator
    safe true
    priority :low

    def generate(site)
      data_dir = site.config['data_dir'] || '_data'
      site_dir = site.config['source']
      feeds_dir = File.join(site_dir, 'feeds')
      FileUtils.mkdir_p(feeds_dir)
      Dir.glob(File.join(site_dir, data_dir, "locations/*.yaml")).each do |location_file|
        next if File.basename(location_file) =~ /_base\.yaml\z/

        location = File.basename(location_file, '.yaml')
        points_of_interest = YAML.load_file(location_file)

        most_recent_post_date = site.time

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

        File.write(File.join(feeds_dir, "#{location}.rss"), rss.to_s)
      end
    end
  end
end
