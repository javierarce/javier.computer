class Player < Liquid::Tag
  def initialize(tag_name, id, tokens)
    super
    data = id.strip.split("|")
    @id = data[0]
    @title = data[1]
  end

  def render(context)
    if @title
    "<div data-video='#{@id}' data-title='#{@title}'></div>"
    else 
    "<div data-video='#{@id}'></div>"
    end
  end
end

Liquid::Template.register_tag('player', Player)
