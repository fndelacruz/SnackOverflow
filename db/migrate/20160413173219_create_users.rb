class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :display_name, null: false
      t.string :password_digest, null: false
      t.string :session_token, null: false, index: { unique: true }
      t.text :bio
      t.string :location
      t.timestamps null: false
    end
  end
end
