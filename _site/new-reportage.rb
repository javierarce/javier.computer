#!/usr/bin/env ruby
require 'date'
require 'fileutils'
require 'active_support/all'
require 'i18n'

begin
  require 'chronic'
rescue LoadError
  puts "Please install the 'chronic' gem: gem install chronic"
  exit 1
end

I18n.available_locales = [:en]

# Parse command line arguments
force_overwrite = false
args = ARGV.dup

# Check for --force flag
if args.include?('--force') || args.include?('-f')
  force_overwrite = true
  args.delete('--force')
  args.delete('-f')
end

title = args[0]
photos = args[1..-1] || []

if !title || photos.empty?
  puts "❌ Please provide a title and at least one photo filename"
  puts "Usage: #{$0} [--force|-f] 'Title' photo1 photo2 photo3..."
  puts "Example: #{$0} 'Berlin Walk' 2025-08-17-Berlin-R0014369 2025-08-17-Berlin-R0014370"
  puts "         #{$0} --force 'Berlin Walk' 2025-08-17-Berlin-R0014369"
  exit 1
end

# Extract date from first photo filename
first_photo = photos.first
date_match = first_photo.match(/^(\d{4}-\d{2}-\d{2})/)
if date_match
  date = Date.parse(date_match[1]).to_time
else
  puts "⚠️  Could not parse date from first photo: #{first_photo}"
  puts "Using current date instead"
  date = Time.now
end

# Extract location from first photo (assumes format: YYYY-MM-DD-Location-Filename)
location_match = first_photo.match(/^\d{4}-\d{2}-\d{2}-([^-]+)/)
location = location_match ? location_match[1].downcase : 'barcelona'

# Camera detection
cameras = []
cameras << "Fuji X-T5" if photos.any? { |p| p =~ /DSCF/i }
cameras << "Ricoh GR IIIx" if photos.any? { |p| p =~ /R00/i }

cover = photos.first

def slugify(title)
  slug = I18n.transliterate(title)
  slug = slug.downcase.gsub(/[^\w\s-]/, '')
  slug = slug.strip.gsub(/\s+/, '-')
  slug.empty? ? 'untitled' : slug
end

slug = slugify(title)
filename = date.strftime("content/_posts/%Y-%m-%d-#{slug}.md")

# Generate filenames section from photos
filenames_section = photos.map do |photo|
  # Default ratio - you might want to adjust this logic
  ratio = "3/2"  # or determine based on filename pattern
  "- filename: #{photo}\n  ratio: #{ratio}"
end.join("\n")

# Build camera section
camera_section = if cameras.size == 1
  "camera: #{cameras.first}"
elsif cameras.size > 1
  "camera:\n" + cameras.map { |cam| "  - #{cam}" }.join("\n")
else
  "camera: "
end

# Build front matter for reportage
front_matter = <<~FRONTMATTER
---
layout: reportage
title: "#{title}"
hide_title: true
date: "#{date.strftime("%Y-%m-%d %H:%M:%S %z")}"
category: reportage
tag: photo
location: #{location}
#{camera_section}
cover: #{cover}
filenames:
#{filenames_section}
---

FRONTMATTER

# Generate content with actual photo includes
photo_includes = photos.map do |photo|
  "{% include photos/custom.html location='#{location}' filename='#{photo}' ratio=\"3/2\" -%}"
end

# Create content structure with all photos
content = <<~CONTENT
<div class="g">
#{photo_includes.join("\n")}
</div>
CONTENT

full_content = front_matter + content

# Create directory if it doesn't exist
FileUtils.mkdir_p("content/_posts")

# Check if file already exists
if File.exist?(filename)
  if force_overwrite
    puts "⚠️  Overwriting existing file: #{filename}"
  else
    puts "🚫 File already exists: #{filename}"
    puts "Use --force or -f to overwrite"
    exit 1
  end
end

# Write the file
File.write(filename, full_content)

# Random emoji selection for success message
emojis = %w[✅ 🥸 🥲 🥰 😌 🙄 🥺 🤭 👽 🤠 💋 💅 🐶 🌈 ✨ 🌱 🔥 🍞 💫 🎈 💥]
puts "#{emojis.sample} New reportage created: #{filename}"

# Usage instructions
puts "\nUsage: #{$0} [--force|-f] 'Title' photo1 photo2 photo3..."
puts "Example: #{$0} 'Berlin Walk' 2025-08-17-Berlin-R0014369 2025-08-17-Berlin-R0014370 2025-08-17-Berlin-R0014371"
puts "         #{$0} --force 'Berlin Walk' 2025-08-17-Berlin-R0014369  # Overwrites existing file"
puts "\nDate and location will be extracted from the first photo filename."
puts "Use --force or -f to overwrite existing files."
