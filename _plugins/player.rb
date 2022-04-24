class Player < Liquid::Tag
  def initialize(tag_name, id, tokens)
    super
    @id = id.strip
  end

  def render(context)
    "<div data-video='#{@id}'></div>"
  end
end

Liquid::Template.register_tag('player', Player)
