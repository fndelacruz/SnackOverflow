json.array!(@questions) do |question|
  json.extract!(question, :id, :title, :content, :created_at, :vote_count,
    :answer_count, :view_count)

  if question.updated_at != question.created_at
    json.updated_at question.updated_at
    json.updated_at_words "edited #{time_ago_in_words(question.updated_at)} ago"
  end

  json.created_at_words "asked #{time_ago_in_words(question.created_at)} ago"

  json.user do
    json.extract!(question.user, :id, :display_name)
    json.reputation @users[question.user.id].reputation
  end

  json.tags question.associated_tags, :id, :name
  json.favorite_count question.favorite_count

  if current_user
    json.user_vote question.user_vote(current_user)
    json.favorite question.owned_favorite(current_user)
    json.owned question.user === current_user
  end
end
