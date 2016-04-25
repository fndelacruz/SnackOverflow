json.extract!(
  answer,
  :id, :created_at, :vote_score, :vote_count
)

json.title answer.question.title
json.type 'Answer'
json.question_id answer.question.id
