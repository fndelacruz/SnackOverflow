# TODO: delete this after purging partials from all views
json.extract!(answer, :id, :created_at, :question_id, :vote_count)
json.title answer.question.title
# NOTE: json.type 'Answer' unnecessary since can distinguish an answer from a
# question by checking post.question_id where post is a question or answer
# json.type 'Answer'
# json.question_id answer.question.id
