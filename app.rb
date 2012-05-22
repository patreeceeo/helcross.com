require 'rubygems'
require 'sinatra'
require 'haml'
require 'maruku'
require 'koala'
require 'rest_client'
require 'pony'
require 'json'

enable :sessions
set :raise_errors, false
set :show_exceptions, false

# Scope defines what permissions that we are asking the user to grant.
# In this example, we are asking for the ability to publish stories
# about using the app, access to what the user likes, and to be able
# to use their pictures.  You should rewrite this scope with whatever
# permissions your app needs.
# See https://developers.facebook.com/docs/reference/api/permissions/
# for a full list of permissions
FACEBOOK_SCOPE = 'user_likes,user_photos,user_photo_video_tags'
                         
ENV["FACEBOOK_APP_ID"] = "368471183197357"
ENV["FACEBOOK_SECRET"] = "6e66e0c89172e31a387be4ce063d0833"

unless ENV["FACEBOOK_APP_ID"] && ENV["FACEBOOK_SECRET"]
  abort("missing env vars: please set FACEBOOK_APP_ID and FACEBOOK_SECRET with your app credentials")
end

before do
  # HTTPS redirect
  if settings.environment == :production && request.scheme != 'https'
    redirect "https://#{request.env['HTTP_HOST']}"
  end
end

# Helpers
require './lib/helpers'
require './lib/partials'
require './lib/db'

helpers do
  def host
    request.env['HTTP_HOST']
  end

  def scheme
    request.scheme
  end

  def url_no_scheme(path = '')
    "//#{host}#{path}"
  end

  def url(path = '')
    "#{scheme}://#{host}#{path}"
  end

  def authenticator
    @authenticator ||= Koala::Facebook::OAuth.new(ENV["FACEBOOK_APP_ID"], ENV["FACEBOOK_SECRET"], url("http://helcross-fbapp.herokuapp.com"))
  end

end

# the facebook session expired! reset ours and restart the process
error(Koala::Facebook::APIError) do
  session[:access_token] = nil
  redirect "/auth/facebook"
end

# Set Sinatra variables
set :app_file, __FILE__
set :root, File.dirname(__FILE__)
set :views, 'views'
set :public_folder, 'public'
set :haml, {:format => :html5} # default Haml format is :xhtml

# used by Canvas apps - redirect the POST to be a regular GET
post "/" do
  redirect "/"
end

# used to close the browser window opened to post to wall/send to friends
get "/close" do
  "<body onload='window.close();'/>"
end

get "/sign_out" do
  session[:access_token] = nil
  redirect '/'
end

get "/auth/facebook" do
  session[:access_token] = nil
  redirect authenticator.url_for_oauth_code(:permissions => FACEBOOK_SCOPE)
end

get '/auth/facebook/callback' do
  session[:access_token] = authenticator.get_access_token(params[:code])
  redirect '/'
end

before '/:page?' do
  # Application routes
  # Get base API Connection
  @graph  = Koala::Facebook::API.new(session[:access_token])

  # Get public details of current application
  @app  =  @graph.get_object(ENV["FACEBOOK_APP_ID"])

  if session[:access_token]
    @user    = @graph.get_object("me")
    @friends = @graph.get_connections('me', 'friends')
    @photos  = @graph.get_connections('me', 'photos')
    @likes   = @graph.get_connections('me', 'likes').first(4)

    # for other data you can always run fql
    @friends_using_app = @graph.fql_query("SELECT uid, name, is_app_user, pic_square FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1")
  end
  @page = params[:page]
end

get '/' do
  puts "@page = '#{@page}'\n" 
  haml :index, :locals => {:page => "home"}, :layout => :'layouts/application'
end

get '/about' do
  puts "@page = '#{@page}'\n" 
  haml :about, :locals => {:page => @page}, :layout => :'layouts/application'
end

get '/store' do
  haml :store, :locals => {:page => @page}, :layout => :'layouts/application'
end

get '/contact' do
  haml :contact, :locals => {:page => @page, :flash => ""}, :layout => :'layouts/application'
end

post '/contact' do
  name = params[:name]
  mail = params[:mail]
  body = params[:body]

  Pony.mail(
    :to => "heltllc@gmail.com", 
    :from => mail, 
    :sender => mail,
    :subject=> "Message from #{name} on Hel+",
    :body => body,
    :via => :smtp, 
    :via_options => {
    :address    => 'smtp.gmail.com',
    :port       => '587',
    :user_name  => 'heltllc@gmail.com',
    :password   => '*{+}%76hX',
    :authentication => :plain,
    :domain     => "gmail.com"
  }   
  )   
  haml :contact, :locals => {:page => @page, :flash => "message_sent"}, :layout => :'layouts/application'
end

get '/forum' do
  haml :forum, :locals => {:page => @page}, :layout => :'layouts/application'
end


before '/cart' do
  content_type :json
  db = DB.new
  session[:cart] ||= {}
  session[:cart][:count] = 0
  session[:cart][:total] = 0
  session[:cart][:item] ||= {}
  session[:cart][:item].each_pair do | id, item |
    price = db.lookup("store_inventory", "price", id);
    session[:cart][:count] += item[:count]
    session[:cart][:total] += item[:count] * price
    item[:name] = db.lookup("store_inventory", "item", id);
    item[:description] = db.lookup("store_inventory", "description", id);
    item[:picture] = db.lookup("store_inventory", "picture", id);
    item[:price] = db.lookup("store_inventory", "price", id);
  end
end

get '/cart' do
  session[:cart].to_json
end


post '/cart' do
  db = DB.new
  action = params["action"]
  id = params["id"].to_i
  puts "post /cart, action: #{action}, id: #{id}"
  if action == "add"
    if db.has_record?("store_inventory", "id", id)
      session[:cart][:item][id] ||= {}
      session[:cart][:item][id][:count] ||= 0 
      session[:cart][:item][id][:count] += 1
      session[:cart][:count] += 1
      session[:cart].merge({message: "You added an item with id #{id} to the cart!"}).to_json
    else
      {
        message: "No such item with id #{id} exists."
      }.to_json
    end
  elsif action == "empty"
    session[:cart] = {}
    session[:cart][:count] = 0
    session[:cart][:total] = 0
    session[:cart].merge({message: "You just emptied the cart all over the aisle! Good job!"}).to_json
  else
    { message: "Unrecognized action" }.to_json
  end
end
