json.extract!(
  question,
  :id, :title, :created_at, :vote_reputation, :vote_count
)

json.type 'Question'

json.question_id question.id
