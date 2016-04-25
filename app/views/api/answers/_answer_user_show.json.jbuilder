json.extract!(
  answer,
  :id, :created_at, :vote_score
)

json.title answer.question.title
json.type 'Answer'
