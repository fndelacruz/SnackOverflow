if options[:stub]
  json.extract!(
    user,
    :id, :display_name, :reputation
  )
elsif options[:show]
  json.extract!(
    user,
    :id, :display_name, :email, :created_at, :updated_at, :vote_count, :bio,
      :reputation, :location, :associated_tags_sorted_by_answer_score,
      :view_count
  )

  json.questions do
    json.array!(user.questions) do |question|
      json.partial!('/api/questions/question_user_show', question: question)
    end
  end

  json.given_answers do
    json.array!(user.given_answers) do |answer|
      json.partial!('/api/answers/answer_user_show', answer: answer)
    end
  end

  json.badgings do
    json.array!(user.badgings) do |badging|
      json.partial!('/api/badgings/badging', badging: badging)
    end
  end

  json.updated_at_words "last seen #{time_ago_in_words(user.updated_at)} ago"
elsif options[:index]
  json.extract!(
    user,
    :id, :display_name, :email, :created_at, :updated_at, :vote_count,
    :reputation, :location, :associated_tags_sorted_by_answer_score
  )

else
  json.extract!(
    user,
    :id, :display_name, :email, :created_at, :updated_at, :vote_count,
      :reputation, :location
  )

  json.created_at_words "#{time_ago_in_words(user.created_at)} ago"
end
