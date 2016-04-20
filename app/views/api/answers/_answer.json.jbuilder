json.user do
  json.partial!('/api/users/user', user: answer.user, options: { stub: true })
end
json.owned answer.user === current_user ? true : false
json.extract!(answer,
  :id, :content, :created_at, :updated_at, :vote_count)
json.created_at_words "answered #{time_ago_in_words(answer.created_at)} ago"
json.updated_at_words "edited #{time_ago_in_words(answer.updated_at)} ago"
json.user_vote answer.user_vote(current_user)
json.comments answer.comments.sort_by(&:id) do |comment|
  json.partial!('/api/comments/comment', comment: comment)
end
