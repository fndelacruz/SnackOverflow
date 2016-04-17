json.extract!(
  question,
  :id, :title, :content, :created_at
)
json.created_at_words "asked #{time_ago_in_words(question.created_at)} ago"
json.updated_at_words "edited #{time_ago_in_words(question.updated_at)} ago"

json.user do
  json.id question.user.id
  json.display_name question.user.display_name
  # TODO: user score count, badges
end

json.vote_count question.vote_count
json.answer_count question.answer_count
json.view_count question.view_count

json.tags question.tags, :id, :name

if show_detail
  json.comments question.comments do |comment|
    json.user comment.user, :id, :display_name
    json.content comment.content
    json.created_at comment.created_at
    json.updated_at comment.updated_at
    json.vote_count comment.vote_count
  end

  json.answers question.answers do |answer|
    json.user answer.user, :id, :display_name
    json.content answer.content
    json.created_at answer.created_at
    json.updated_at answer.updated_at
    json.vote_count answer.vote_count
  end

  json.favorite_count question.favorite_count
end
