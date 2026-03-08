module PhotoLayout
  class PhotoStack < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @extra_classes = markup.strip
    end

    def render(context)
      content = super
      classes = ['g', @extra_classes].reject(&:empty?).join(' ')
      "<div class=\"#{classes}\">#{content}</div>"
    end
  end

  class PhotoRow < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @extra_classes = markup.strip
    end

    def render(context)
      content = super
      classes = ['h', @extra_classes].reject(&:empty?).join(' ')
      "<div class=\"#{classes}\">#{content}</div>"
    end
  end

  class PhotoText < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @extra_classes = markup.strip
    end

    def render(context)
      content = super
      classes = ['t', @extra_classes].reject(&:empty?).join(' ')
      "<div class=\"#{classes}\">#{content}</div>"
    end
  end

  class PhotoGrid < Liquid::Block
    def initialize(tag_name, markup, tokens)
      super
      @extra_classes = markup.strip
    end

    def render(context)
      content = super
      classes = ['gg', @extra_classes].reject(&:empty?).join(' ')
      "<div class=\"#{classes}\">#{content}</div>"
    end
  end
end

Liquid::Template.register_tag('stack', PhotoLayout::PhotoStack)
Liquid::Template.register_tag('row', PhotoLayout::PhotoRow)
Liquid::Template.register_tag('text', PhotoLayout::PhotoText)
Liquid::Template.register_tag('grid', PhotoLayout::PhotoGrid)
