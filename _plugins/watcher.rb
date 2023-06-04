Jekyll::Hooks.register :site, :post_write do |site|
  if ENV['JEKYLL_ENV'] != 'development'
    puts "Copying feeds"
    system("ruby copy_feeds.rb")
  end
end
