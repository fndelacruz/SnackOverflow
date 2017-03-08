class FixVoteIndexes < ActiveRecord::Migration
  def change
    remove_index :votes, [:user_id, :votable_type, :votable_id]
    remove_index :votes, [:votable_id]
    remove_index :votes, [:votable_type]

    # for fetching a particular user's votes
    add_index :votes, [:user_id, :votable_id, :votable_type]

    # for fetching votes form any votable
    add_index :votes, [:votable_id, :votable_type]
  end
end
