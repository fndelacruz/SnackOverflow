if options[:stub]

else
  json.extract!(
    tag,
    :id, :name, :created_at, :description
  )
  json.question_count tag.questions.length
end
