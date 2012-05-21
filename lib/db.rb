# require "sqlite3"
require "syck"
require "rest_client"
require "./lib/helpers"


module Sinatra

  module DBHelper

    def data
      @data ||= Syck.load(RestClient.get s3_link("/data.yaml"))
    end

    def each_table_row(table_name, &clsr)
      data[table_name].each do |row|
        clsr.call(row)
      end
    end
  end

  helpers DBHelper
end














# db = SQLite3::Database.new('helcross.com')
#
# db.execute <<SQL
#   DROP TABLE IF EXISTS store_inventory; 
#   CREATE TABLE store_inventory (
#     name VARCHAR(255),
#     description VARCHAR(255),
#     picture VARCHAR(255),
#     price INTEGER,
#     in_stock INTEGER,
#     );
# SQL

# data = Psych.load(RestClient.get s3_link("/data.yaml"))

# data.each_pair do |table_name, table_contents|
#   table_contents.each do |row|
#     row.each_pair do |column_name, record_value|
#       query =<<SQL
#         INSERT INTO #{table_name} (#{column_name}) 
#         VALUES (#{record_value});
# SQL
#       binding.pry 
#     end
#   end
# end
