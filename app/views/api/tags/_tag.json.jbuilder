# if options[:stub]

json.extract!(
  tag,
  :id, :name, :created_at, :description
)

if options[:index]
  # json.question_count tag.questions.length
  json.extract!(
    tag,
    :question_count, :weekly_question_count, :monthly_question_count
  )
end
