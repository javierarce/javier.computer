class Single < Liquid::Block
  def initialize(tag_name, markup, tokens)
    super
    @extra_classes = markup.strip
  end

  def render(context)
    content = super
    classes = ['single', @extra_classes].reject(&:empty?).join(' ')
    "<div class=\"#{classes}\">#{content}</div>"
  end
end

Liquid::Template.register_tag('single', Single)
