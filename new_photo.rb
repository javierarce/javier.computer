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

title = ARGV[0] || 'untitled'
date_input = ARGV[1] || 'now'

date = Chronic.parse(date_input) || Time.now

def slugify(title)
  slug = I18n.transliterate(title)
  slug = slug.downcase.gsub(/[^\w\s-]/, '')
  slug = slug.strip.gsub(/\s+/, '-')
  slug.empty? ? 'untitled' : slug
end

slug = slugify(title)
filename = date.strftime("content/_posts/%Y-%m-%d-#{slug}.md")

front_matter = <<~FRONTMATTER
  ---
  layout: photos/photo
  category: photo
  location: barcelona
  title: "#{title}"
  date: "#{date.strftime("%Y-%m-%d %H:%M:%S %z")}"
  camera: Ricoh GR IIIx
  hide_title: true
  hide: false
  filenames:
  - filename: 
    caption: 
    ratio: 3/2
  ---
FRONTMATTER

FileUtils.mkdir_p("content/_posts")

if File.exist?(filename)
  puts "🚫 File already exists: #{filename}"
  exit 1
end

File.write(filename, front_matter)

emojis = %w[✅ 🥸 🥲 🥰 😌 🙄 🥺 🤭 👽 🤠 💋 💅 🐶 🌈 ✨ 🌱 🔥 🍞 💫 🎈 💥]
puts "#{emojis.sample} New post created: #{filename}"
