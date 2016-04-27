class AddBadgeSubcategory < ActiveRecord::Migration
  def change
    add_column :badges, :subcategory, :string, null: false
  end
end
