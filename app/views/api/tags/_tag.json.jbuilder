# if options[:stub]

json.extract!(
  tag,
  :id, :name, :created_at, :description
)

if options[:index]
  json.question_count tag.questions.length
end
