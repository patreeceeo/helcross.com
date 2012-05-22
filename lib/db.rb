# require "sqlite3"
require "syck"
require "rest_client"
require "./lib/helpers"




module Sinatra

  module DBHelper

    public

    def data
      @data ||= Syck.load(RestClient.get s3_link("/data.yaml"))
    end

    def has_record?(tablename, colname, value)
      table = data[tablename]
      table.each do | row |
        if row[colname] == value
          return true
        end
      end
      false
    end

    def lookup(tablename, colname, id)
      table = data[tablename]
      table.each do | row |
        if row["id"] == id
          return row[colname]
        end
      end
    end

    def default_options
      { chunk_size: 1 }
    end

    def each_table_row(table_name, options=default_options, &clsr)
      chunk_size = options[:chunk_size];
      if chunk_size > 1
        chunk = []
        data[table_name].each do |row|
          chunk << row 
          if chunk.length == chunk_size
            clsr.call(chunk)
            chunk = []
          end
        end 
      else
        data[table_name].each do |row|
          clsr.call(row)
        end
      end
    end
  end

  helpers DBHelper
end

class DB
  include Sinatra::DBHelper
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
