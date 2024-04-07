module Jekyll
  module RandomNumberFilter
    def random_number(input)
      rand(input.to_i)
    end
  end
end

Liquid::Template.register_filter(Jekyll::RandomNumberFilter)
