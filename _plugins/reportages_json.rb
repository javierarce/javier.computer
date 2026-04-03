require "json"

Jekyll::Hooks.register :site, :post_write do |site|
  reportages = (site.posts.docs + site.collections["photos"].docs)
    .select { |d| d.data["layout"] == "reportage" }
    .sort_by { |d| d.data["date"] || Time.now }
    .reverse

  items = reportages.map do |doc|
    # Read raw file and split off frontmatter + body
    raw = File.read(doc.path)
    {
      title: doc.data["title"],
      date: (doc.data["date"] || Time.now).strftime("%Y-%m-%d"),
      path: doc.relative_path,
      raw: raw
    }
  end

  out = File.join(site.dest, "tools", "reportages.json")
  FileUtils.mkdir_p(File.dirname(out))
  File.write(out, JSON.generate(items))
end
