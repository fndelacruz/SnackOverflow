class CreateBadgings < ActiveRecord::Migration
  def change
    create_table :badgings do |t|
      t.integer :user_id, null: false, index: true
      t.integer :badge_id, null: false, index: true
      t.timestamps null: false
    end
  end
end
