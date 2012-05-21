require "psych"
require "yaml"
require "./lib/helpers"

# stolen from http://github.com/cschneid/irclogger/blob/master/lib/partials.rb
#   and made a lot more robust by me
# this implementation uses erb by default. if you want to use any other template mechanism
#   then replace `erb` on line 13 and line 17 with `haml` or whatever 
module Sinatra
  module Partials

    def partial(template, *args)
      template_array = template.to_s.split('/')
      template = template_array[0..-2].join('/') + "/_#{template_array[-1]}"
      options = args.last.is_a?(Hash) ? args.pop : {}
      options.merge!(:layout => false)
      locals = options[:locals] || {}
      if collection = options.delete(:collection) then
        collection.inject([]) do |buffer, member|
          buffer << haml(:"#{template}", options.merge(:layout =>
          false, :locals => {template_array[-1].to_sym => member}.merge(locals)))
        end.join("\n")
      else
        haml(:"#{template}", options)
      end
    end


    def content(name, default="")
      print "attempting to fetch content: #{name}"
      begin
        link = s3_link "/texts/#{name}.md.txt"
        puts "link = #{link}\n"
        contents = RestClient.get link
        doc = Maruku.new(contents)
        doc.to_html
      rescue
        default
      end
    end

    def each_content_item(type, &block)
      arr = (RestClient.get s3_link "/settings/#{type}.list").split
      arr.each do |item| 
        block.call(item)
      end
      nil
    end

    def load_data_for(name)
      return YAML.load(RestClient.get s3_link "/texts/#{name}.yaml")
    end
  end

  helpers Partials
end
