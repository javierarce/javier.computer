Jekyll::Hooks.register :posts, :post_write do |post|
  all_existing_locations = Dir.entries('content/_locations')
    .map { |t| t.match(/(.*).md/) }
    .compact.map { |m| m[1] }

  if post['location']
    location = post['location']
    generate_location_file(location) if !all_existing_locations.include?(location)
  end
end

def generate_location_file(location)
  File.open("content/_locations/#{location}.md", "wb") do |file|
    file << "---\nlayout: location\ntitle: #{location.capitalize}\nlocation: #{location}\npermalink: in/#{location}\n---\n"
  end
end
