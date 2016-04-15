json.extract!(
  question,
  :id, :title, :content, :created_at
)
json.created_at_words "asked #{time_ago_in_words(question.created_at)} ago"

json.user do
  json.id question.user.id
  json.display_name question.user.display_name
  # TODO: user score count, badges
end

json.vote_count question.vote_count
json.answer_count question.answer_count
json.view_count question.view_count

json.tags question.tags, :id, :name

# TODO: add vote_count, answer_count, view_count

if show_detail
  # TODO: add answers and comments
end
