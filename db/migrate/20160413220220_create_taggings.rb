class CreateTaggings < ActiveRecord::Migration
  def change
    create_table :taggings do |t|
      t.integer :question_id, null: false, index: true
      t.integer :tag_id, null: false
      t.timestamps null: false
    end

    add_index :taggings, [:tag_id, :question_id], unique: true
  end
end
