module Jekyll
  class MovieYearPage < Page
    def initialize(site, base, year, all_years)
      @site = site
      @base = base
      @dir = "movies/#{year}"
      @name = "index.html"

      self.process(@name)
      self.content = ""
      self.data = {
        'layout' => 'movies',
        'title' => 'Movies',
        'description' => "Movies I've watched in #{year}",
        'className' => 'Movies',
        'movie_year' => year.to_s,
        'all_years' => all_years.map(&:to_s)
      }
    end
  end

  class MovieYearGenerator < Generator
    safe true
    priority :low

    def generate(site)
      movies = site.collections['movies']&.docs
      return if movies.nil? || movies.empty?

      years = movies.map { |m| m.data['watched_on']&.strftime('%Y') }.compact.uniq.sort.reverse
      return if years.empty?

      latest_year = years.first

      # Set data on the main /movies page so the layout can use it
      movies_page = site.pages.find { |p| p.data['layout'] == 'movies' }
      if movies_page
        movies_page.data['movie_year'] = latest_year
        movies_page.data['all_years'] = years
      end

      # Generate a page for each year (skip latest since main page handles it)
      years.each do |year|
        next if year == latest_year
        site.pages << MovieYearPage.new(site, site.source, year, years)
      end
    end
  end
end
