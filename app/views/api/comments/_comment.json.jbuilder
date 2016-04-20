json.user do
  json.partial!('/api/users/user', user: comment.user, options: { stub: true })
end
json.owned comment.user === current_user ? true : false
json.extract!(comment,
  :id, :content, :created_at, :updated_at, :vote_count)
json.user_vote comment.user_vote(current_user)
json.created_at_words "#{time_ago_in_words(comment.created_at)} ago"
