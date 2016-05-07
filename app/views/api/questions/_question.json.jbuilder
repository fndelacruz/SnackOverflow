json.extract!(question,
  :id, :title, :content, :created_at, :vote_count, :answer_count,
    :view_count
)

if question.updated_at != question.created_at
  json.updated_at question.updated_at
  json.updated_at_words "edited #{time_ago_in_words(question.updated_at)} ago"
end

json.created_at_words "asked #{time_ago_in_words(question.created_at)} ago"

json.user do
  json.partial!('/api/users/user', user: question.user, options: { stub: true })
end

json.owned question.user === current_user ? true : false

json.tags question.associated_tags, :id, :name

json.user_vote question.user_vote(current_user)

json.favorite_count question.favorite_count
json.favorite question.owned_favorite(current_user)

if show_detail
  json.comments question.comments.sort_by(&:id) do |comment|
    json.partial!('/api/comments/comment', comment: comment)
  end

  json.answers question.answers do |answer|
    json.partial!('/api/answers/answer', answer: answer)
  end

  json.user_answered question.user_answered?(current_user)
else
  json.answers []
  json.comments []
end
