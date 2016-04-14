class CreateViews < ActiveRecord::Migration
  def change
    create_table :views do |t|
      t.integer :user_id, null: false
      t.string :viewable_type, null: false, index: true
      t.integer :viewable_id, null: false, index: true
      t.timestamps null: false
    end

    add_index :views, [:user_id, :viewable_type, :viewable_id]
  end
end
