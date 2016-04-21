class AddTagDescription < ActiveRecord::Migration
  def change
    add_column :tags, :description, :text, null: false
  end
end
