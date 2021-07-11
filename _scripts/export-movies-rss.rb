require 'rss'
require 'open-uri'

url = 'https://letterboxd.com/javier/rss'

def extractData(item)
  item.description.match('Watched on (.*?).<\/p>')
  date = $1

  item.description.match('src="(.*?)"')
  img = $1

  item.title.match('(.*), (\d{4})(.*)?$')

  return $1, $2, $3, img, date
end

open(url) do |rss|
  feed = RSS::Parser.parse(rss)

  movies = []
  feed.items.each do |item|
    title, year, stars, img, date = extractData(item)

    if title
      movies.push("- title: '#{title}'")
      movies.push("  year: #{year}")
      movies.push("  img: #{img}")
      movies.push("  url: #{item.link}")

      if date
        movies.push("  date: #{Date.parse date}")
      end

      if stars
        movies.push ("  stars: '#{stars.gsub(' - ', '')}'")
      end

      movies.push("  \n")
    end

  end
    File.open('movies_.yml', 'w+') { |file| 
      file.puts(movies)
    }
end
