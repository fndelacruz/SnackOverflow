json.array!(@questions) do |question|
  json.partial!('question', question: question, show_detail: false)
end
