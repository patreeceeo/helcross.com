def aws_key
  "ASIAJIQ25LY7GKLZSZNQ"
end 

def s3_link(path)
  print "Linking to #{path} in S3"
  "https://s3.amazonaws.com/helcross-content#{path}?AWSAccessKeyId=#{aws_key}"
end

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

