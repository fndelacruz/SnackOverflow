class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.integer :user_id, null: false, index: true
      t.string :title, null: false
      t.text :content, null: false
      t.timestamps null: false
    end
  end
end
