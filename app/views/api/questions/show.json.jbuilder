json.extract!(@question,
  :id, :title, :content, :created_at, :vote_count, :answer_count,
    :view_count
)

if @question.updated_at != @question.created_at
  json.updated_at @question.updated_at
  json.updated_at_words "edited #{time_ago_in_words(@question.updated_at)} ago"
end

json.created_at_words "asked #{time_ago_in_words(@question.created_at)} ago"

json.user do
  json.partial!('/api/users/user', user: @question.user)
  json.reputation @users[@question.user.id].reputation
end

json.owned @question.user === current_user ? true : false

json.tags @question.associated_tags, :id, :name

json.user_vote @question.user_vote(current_user)

json.favorite_count @question.favorite_count
json.favorite @question.owned_favorite(current_user)

json.comments @question.comments.sort_by(&:created_at) do |comment|
  json.user { json.partial!('/api/users/user', user: comment.user) }

  json.owned comment.user === current_user ? true : false
  json.extract!(comment,
    :id, :content, :created_at, :updated_at, :vote_count)
  json.user_vote comment.user_vote(current_user)
  json.created_at_words "#{time_ago_in_words(comment.created_at)} ago"
end

json.answers @question.answers do |answer|
  json.user do
    json.partial!('/api/users/user', user: answer.user)
    json.reputation @users[answer.user.id].reputation
  end

  json.owned answer.user === current_user ? true : false
  json.extract!(answer,
    :id, :content, :question_id, :created_at, :vote_count)

  if answer.updated_at != answer.created_at
    json.updated_at answer.updated_at
    json.updated_at_words "edited #{time_ago_in_words(answer.updated_at)} ago"
  end

  json.created_at_words "answered #{time_ago_in_words(answer.created_at)} ago"
  json.user_vote answer.user_vote(current_user)

  json.comments answer.comments.sort_by(&:created_at) do |comment|
    json.user { json.partial!('/api/users/user', user: comment.user) }
    json.extract!(comment,
      :id, :content, :created_at, :updated_at, :vote_count)

    json.owned comment.user === current_user ? true : false
    json.user_vote comment.user_vote(current_user)
    json.created_at_words "#{time_ago_in_words(comment.created_at)} ago"
  end
end

json.user_answered @question.user_answered?(current_user)
