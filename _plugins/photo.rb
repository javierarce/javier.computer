class Photo < Liquid::Tag
  def initialize(tag_name, markup, tokens)
    super
    parse_params(markup.strip)
  end

  def parse_params(markup)
    @location  = nil
    @filename  = nil
    @ratio     = nil
    @alt       = nil
    @caption   = nil
    @classname = nil

    remaining = markup.dup

    # Extract named params: key:"value", key:'value', or key:bare_value
    remaining.gsub!(/(\w+):"([^"]*)"/)  { assign_named($1, $2); '' }
    remaining.gsub!(/(\w+):'([^']*)'/)  { assign_named($1, $2); '' }
    remaining.gsub!(/(\w+):(\S+)/)      { assign_named($1, $2); '' }

    # Remaining tokens are positional: location filename [ratio]
    parts = remaining.strip.split(/\s+/).reject(&:empty?)
    @location = parts[0]
    @filename = parts[1]
    @ratio    = parts[2] if parts[2] =~ /^\d+\/\d+$/
  end

  def assign_named(key, value)
    case key
    when 'alt'     then @alt       = value
    when 'caption' then @caption   = value
    when 'class'   then @classname = value
    when 'ratio'   then @ratio     = value
    end
  end

  def render(context)
    base      = "https://img.javier.computer/#{@location}/#{@filename}"
    alt_text  = @alt || @caption || ''
    css_class = ['Photo', @classname].compact.join(' ')

    style          = @ratio    ? " style=\"--aspect-ratio: #{@ratio};\""   : ''
    alt_attr       = alt_text != '' ? " alt=\"#{alt_text}\""               : ''
    caption_attr   = @caption  ? " data-caption=\"#{@caption}\""           : ''
    figcaption_tag = @caption  ? "\n      <figcaption>#{@caption}</figcaption>" : ''

    <<~HTML
      <div class="#{css_class}">
        <div class="Photo__content">
          <figure class="figure">
            <picture>
              <source data-srcset="#{base}_2880.webp 2880w" type="image/webp">
              <source data-srcset="#{base}_2880.jpg 2880w">
              <img class="lazy" data-src="#{base}_2880.jpg"#{style}#{alt_attr}#{caption_attr}>
            </picture>
          </figure>#{figcaption_tag}
        </div>
      </div>
    HTML
  end
end

Liquid::Template.register_tag('photo', Photo)
