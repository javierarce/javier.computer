Jekyll::Hooks.register :posts, :post_write do |post|
  # Locations are canonically lowercase: the filesystem is case-insensitive on
  # macOS, so a post with `location: Berlin` would otherwise reopen (and
  # truncate) the existing berlin.md and overwrite its hand-written title.
  location = post['location'].to_s.strip.downcase
  next if location.empty?

  all_existing_locations = Dir.entries('content/_locations')
    .map { |t| t.match(/(.*)\.md\z/) }
    .compact.map { |m| m[1].downcase }

  generate_location_file(location) unless all_existing_locations.include?(location)
end

def generate_location_file(location)
  path = "content/_locations/#{location}.md"
  return if File.exist?(path)

  File.open(path, "wb") do |file|
    file << "---\nlayout: location\ntitle: #{location.capitalize}\nlocation: #{location}\npermalink: in/#{location}\n---\n"
  end
end
