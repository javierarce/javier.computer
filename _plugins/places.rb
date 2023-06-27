require 'yaml'

module Jekyll
  class LocationFileGenerator < Generator
    safe true
    priority :lowest

    def generate(site)
      locations_hash = Hash.new { |hash, key| hash[key] = [] }
      address_hash = {}

      # Load base location data
      Dir.glob('_data/locations/*_base.yaml').each do |base_file|
        location_name = File.basename(base_file, '_base.yaml').sub('_base', '')
        base_locations = YAML.load_file(base_file) || []
        
        if base_locations.is_a? Array
          base_locations.each do |base_location|
            base_location['post_references'] ||= []
            
            if address_hash[base_location['address']].nil?
              address_hash[base_location['address']] = base_location
              locations_hash[location_name] << base_location
            end
          end
        end
      end

      # Process post locations
      site.posts.docs.each do |post|
        if post.data['locations']
          post.data['locations'].each do |location|
            location['post_references'] ||= []
            post_ref = { 'url' => post.url, 'title' => post.data['title'], 'date' => post.data['date'] }
            location['post_references'] << post_ref

            if address_hash[location['address']].nil?
              address_hash[location['address']] = location
              locations_hash[location['location']] << location
            else
              address_hash[location['address']]['post_references'] |= location['post_references']
            end
          end
        end
      end

      locations_hash.each do |location, data|
        yaml_file_path = "_data/locations/#{location}.yaml"

        if File.exists?(yaml_file_path)
          current_data = YAML.load_file(yaml_file_path)
          next if current_data == data
        end

        File.open(yaml_file_path, 'w') do |file|
          file.write(data.to_yaml)
        end
      end
    end
  end
end
