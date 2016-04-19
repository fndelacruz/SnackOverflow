json.user comment.user, :id, :display_name
json.owned comment.user === current_user ? true : false
json.extract!(comment,
  :id, :content, :created_at, :updated_at, :vote_count)
json.user_vote comment.user_vote(current_user.id)
json.created_at_words "#{time_ago_in_words(comment.created_at)} ago"
