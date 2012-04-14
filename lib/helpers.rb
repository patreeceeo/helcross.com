module Sinatra
  module Helpers
    def crossify(s)
      s.gsub("-cross-", "+").gsub("cross-", "+").gsub("-cross", "+") 
    end

    def decrossify(s)
      s.gsub(/[^\+]+\+[^\+]+/, "-cross-").gsub(/\+[^\+]+/, "cross-").gsub(/[^\+]+\+/, "-cross")
    end

    def lib_script(name)
      "<script id='#{name}' type='text/javascript' src='/javascripts/lib/#{name}.js' ></script>"
    end

  end
  helpers Helpers
end
