class Photo < Liquid::Tag
  def initialize(tag_name, filename, tokens)
    super
    @filename = filename.strip
  end

  def render(context)
    "<div class='Photo'>
    <div class='Photo__content'>
    <figure class='Figure'>
        <picture>

          <source data-srcset='https://img.javier.computer/#{@filename}_640.webp 640w, https://img.javier.computer/#{@filename}_1280.webp 1280w, https://img.javier.computer/#{@filename}_2880.webp 2880w' type='image/webp'>

          <source data-srcset='https://img.javier.computer/#{@filename}_640.jpg 640w, https://img.javier.computer/#{@filename}_1280.jpg 1280w, https://img.javier.computer/#{@filename}_2880.jpg 2880w'>

          <img class='lazy' data-src='https://img.javier.computer/#{@filename}_1280.jpg'>

          </picture>
      </figure>
         </div>  

      </div>  

    "
  end
end

Liquid::Template.register_tag('photo', Photo)
