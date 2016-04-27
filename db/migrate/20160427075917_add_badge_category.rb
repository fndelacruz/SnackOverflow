class AddBadgeCategory < ActiveRecord::Migration
  def change
    add_column :badges, :category, :string, null: false
  end
end
