class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.integer :user_id, null: false
      t.string :votable_type, null: false, index: true
      t.integer :votable_id, null: false, index: true
      t.integer :value, null: false
      t.timestamps null: false
    end

    add_index :votes, [:user_id, :votable_type, :votable_id], unique: true
  end
end
