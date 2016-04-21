if options[:stub]

else
  json.extract!(
    tag,
    :id, :name, :created_at
  )
  json.question_count tag.questions.length
end
