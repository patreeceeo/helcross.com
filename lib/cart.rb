require './lib/db'


module Sinatra
  module CartHelper
    def can_add_to_cart?(id)
      @@db ||= DB.new
      @@db.flatten_tables_up("store_inventory", "items", "store_inventory_items")
      @@db.has_record?("store_inventory_items", "id", id) 
    end

    def update_cart
      @@db ||= DB.new
      session[:cart] ||= {}
      session[:cart][:count] = 0
      session[:cart][:total] = 0
      session[:cart][:item] ||= {}
      session[:cart][:item].each_pair do | id, item |
        @@db.flatten_tables_up("store_inventory", "items", "store_inventory_items")
        price = @@db.lookup("store_inventory_items", "price", id)

        session[:cart][:count] += item[:count]
        session[:cart][:total] += item[:count] * price
        item_name = @@db.lookup("store_inventory_items", "item", id);
        group_name = @@db.lookup("store_inventory_items", "group", id);
        item[:name] = group_name + ": " + item_name
        item[:description] = @@db.lookup("store_inventory_items", "description", id);
        item[:picture] = @@db.lookup("store_inventory_items", "picture", id);
        item[:price] = @@db.lookup("store_inventory_items", "price", id);
      end
      session[:cart]
    end

    def add_to_cart(item_id)
      session[:cart][:item][item_id] ||= {}
      session[:cart][:item][item_id][:count] ||= 0 
      session[:cart][:item][item_id][:count] += 1
      update_cart
    end

    def empty_cart
      session[:cart] = {}
      session[:cart][:count] = 0
      session[:cart][:total] = 0
      update_cart
    end

  end
  helpers CartHelper
end
