Jekyll::Hooks.register :posts, :post_write do |post|
  all_existing_tags = Dir.entries("tags")
    .map { |t| t.match(/(.*).md/) }
    .compact.map { |m| m[1] }

  tags = post['tags'].reject { |t| t.empty? }
  tags.each do |tag|
    generate_tag_file(tag) if !all_existing_tags.include?(tag)
  end
end

def generate_tag_file(tag)
  File.open("tag/#{tag}.md", "wb") do |file|
    file << "---\nlayout: tag\ntag: #{tag}\n---\n"
  end
end
