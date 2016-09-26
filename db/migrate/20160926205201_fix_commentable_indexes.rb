class FixCommentableIndexes < ActiveRecord::Migration
  def change
    remove_index :comments, :commentable_id
    remove_index :comments, :commentable_type
    add_index :comments, [:commentable_id, :commentable_type]
  end
end
