class AddUnreadAnswersCommentsVotes < ActiveRecord::Migration
  def change
    add_column :answers, :unread, :boolean, default: true
    add_column :comments, :unread, :boolean, default: true
    add_column :votes, :unread, :boolean, default: true
  end
end
