require 'fileutils'

source_dir = File.expand_path('feeds')
output_dir = File.expand_path('docs/feeds')

FileUtils.mkdir_p(output_dir)
FileUtils.cp_r(Dir.glob(File.join(source_dir, '*')), output_dir)
