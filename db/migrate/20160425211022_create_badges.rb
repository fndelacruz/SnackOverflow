class CreateBadges < ActiveRecord::Migration
  def change
    create_table :badges do |t|
      t.string :name, null: false
      t.string :rank, null: false
      t.text :description, null: false
      t.timestamps
    end

    add_index :badges, [:name, :rank], unique: true
  end
end
