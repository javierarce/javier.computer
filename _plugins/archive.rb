module Jekyll
  class ArchiveYearPage < Page
    def initialize(site, base, year, all_years)
      @site = site
      @base = base
      @dir = "posts/#{year}"
      @name = "index.html"

      self.process(@name)
      self.content = ""
      self.data = {
        'layout' => 'archive',
        'title' => 'Archivo',
        'className' => 'archive',
        'category' => 'posts',
        'archive_year' => year.to_s,
        'all_years' => all_years.map(&:to_s)
      }
    end
  end

  class ArchiveYearGenerator < Generator
    safe true
    priority :low

    def generate(site)
      posts = site.posts.docs
      return if posts.empty?

      years = posts.map { |p| p.date.strftime('%Y') }.uniq.sort.reverse
      return if years.empty?

      latest_year = years.first

      archive_page = site.pages.find { |p| p.data['permalink'] == 'posts' }
      if archive_page
        archive_page.data['layout'] = 'archive'
        archive_page.data['archive_year'] = latest_year
        archive_page.data['all_years'] = years
      end

      years.each do |year|
        next if year == latest_year
        site.pages << ArchiveYearPage.new(site, site.source, year, years)
      end
    end
  end
end
