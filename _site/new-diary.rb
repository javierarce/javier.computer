#!/usr/bin/env ruby
require 'date'
require 'fileutils'
require 'i18n'

I18n.available_locales = [:en]

if ARGV.length < 3
  puts "Usage: new-photo TITLE LOCATION FILE1 [FILE2 ...]"
  exit 1
end

title = ARGV.shift
location = ARGV.shift
photos = ARGV

# Slugify title
def slugify(str)
  slug = I18n.transliterate(str)
  slug = slug.downcase.gsub(/[^\w\s-]/, '')
  slug.strip.gsub(/\s+/, '-')
end

slug = slugify(title)

time_now = Time.now
date_str = time_now.strftime("%Y-%m-%d %H:%M:%S %z")

# Camera detection
cameras = []
cameras << "Fuji X-T5" if photos.any? { |p| p =~ /DSCF/i }
cameras << "Ricoh GR IIIx" if photos.any? { |p| p =~ /R00/i }

# Build front matter
front_matter = <<~FRONTMATTER
  ---
  layout: photos/photo
  title: "#{title}"
  date: "#{date_str}"
  category: photo
  location: #{location}
  filenames:
FRONTMATTER

photos.each do |photo|
  front_matter << "  - filename: #{photo}\n"
  front_matter << "    caption: \n"
  front_matter << "    ratio: 3/2\n"
end

if cameras.size == 1
  front_matter << "camera: #{cameras.first}\n"
elsif cameras.size > 1
  front_matter << "camera:\n"
  cameras.each { |cam| front_matter << "  - #{cam}\n" }
else
  front_matter << "camera: \n"
end

front_matter << <<~FRONTMATTER
  hide_title: true
  hide: true
  ---
FRONTMATTER

# Save file
FileUtils.mkdir_p("content/_posts")
md_filename = time_now.strftime("content/_posts/%Y-%m-%d-#{slug}.md")

if File.exist?(md_filename)
  puts "🚫 File already exists: #{md_filename}"
  exit 1
end

File.write(md_filename, front_matter)
puts "✅ New photo diary entry created: #{md_filename}"
