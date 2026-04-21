module Jekyll
  module RandomNumberFilter
    def random_number(input)
      rand(input.to_i)
    end

    def random_number_excluding(input, exclude)
      max = input.to_i
      return rand(max) if exclude.nil? || exclude.to_s.empty? || max <= 1
      exclude_i = exclude.to_i
      return rand(max) if exclude_i < 0 || exclude_i >= max
      n = rand(max - 1)
      n >= exclude_i ? n + 1 : n
    end
  end
end

Liquid::Template.register_filter(Jekyll::RandomNumberFilter)
