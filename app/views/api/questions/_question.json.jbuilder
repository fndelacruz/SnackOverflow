json.extract!(question,
  :id, :title, :content, :created_at, :vote_count, :answer_count, :view_count
)
json.created_at_words "asked #{time_ago_in_words(question.created_at)} ago"
json.updated_at_words "edited #{time_ago_in_words(question.updated_at)} ago"

json.user do
  json.id question.user.id
  json.display_name question.user.display_name
  # TODO: user score count, badges
end

json.tags question.tags, :id, :name

json.user_vote question.user_vote(current_user.id)
json.favorite_count question.favorite_count

if show_detail
  json.favorite question
    .favorites
    .find { |favorite| favorite.user_id == current_user.id }


  json.comments question.comments do |comment|
    json.user comment.user, :id, :display_name
    json.extract!(comment,
      :id, :content, :created_at, :updated_at, :vote_count)
    json.user_vote comment.user_vote(current_user.id)
  end

  json.answers question.answers do |answer|
    json.user answer.user, :id, :display_name
    json.extract!(answer,
      :id, :content, :created_at, :updated_at, :vote_count)
    json.created_at_words "answered #{time_ago_in_words(answer.created_at)} ago"
    json.updated_at_words "edited #{time_ago_in_words(answer.updated_at)} ago"
    json.user_vote answer.user_vote(current_user.id)
  end

else
  json.answers []
  json.comments []
end
