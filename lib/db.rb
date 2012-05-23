# require "sqlite3"
require "syck"
require "rest_client"
require "./lib/helpers"




module Sinatra

  module DBHelper

    public

    def data
      @@data ||= Syck.load(RestClient.get s3_link("/data.yaml"))
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

    def has_table(table_name)
      data.has_key?(table_name)
    end

    def get_table(table_name)
      return data[table_name]
    end

    def flatten_tables_up(table_aug, table_nested, table_new)
      if not has_table(table_new)
        data[table_new] = []
        data[table_aug].each do |row1|
          row1[table_nested].each do |row2|
            row1.delete(table_nested)
            data[table_new] << row1.merge(row2)
          end
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
