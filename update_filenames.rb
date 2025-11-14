#!/usr/bin/env ruby
# frozen_string_literal: true

# Usage:
#   ruby update_filenames.rb path/to/file.md

require "yaml"

abort "Please provide a file path" unless ARGV[0]
path = ARGV[0]
abort "File not found: #{path}" unless File.exist?(path)

content = File.read(path)

# --- Split front-matter and body ---
if content =~ /\A---\s*\n(.+?)\n---\s*\n/m
  front_matter_raw = Regexp.last_match(1)
  body = content.sub(/\A---\s*\n.+?\n---\s*\n/m, "")
else
  abort "No valid front matter found"
end

front_matter = YAML.safe_load(front_matter_raw)

# --- Parse includes from body ---
INCLUDE_REGEX = /
  include\s+photos\/custom\.html
  [^%]*filename=['"]([^'"]+)['"]
  [^%]*ratio=['"]([^'"]+)['"]
/x

filenames = body.scan(INCLUDE_REGEX).map do |filename, ratio|
  {
    "filename" => filename,
    "ratio" => ratio
  }
end

# --- Replace filenames: section ---
front_matter["filenames"] = filenames

# --- Rebuild file ---
new_front_matter = front_matter.to_yaml.strip
output = +"---\n#{new_front_matter}\n---\n\n#{body}"

File.write(path, output)

puts "Updated filenames in #{path}"
