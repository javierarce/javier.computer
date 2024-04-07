module Jekyll
  module RangeMapper
    def map_range(value, from_min, from_max, to_min, to_max)
      value = value.to_f
      from_min = from_min.to_f
      from_max = from_max.to_f
      to_min = to_min.to_f
      to_max = to_max.to_f
      
      ((value - from_min) / (from_max - from_min) * (to_max - to_min) + to_min).round
    end
  end
end

Liquid::Template.register_filter(Jekyll::RangeMapper)
