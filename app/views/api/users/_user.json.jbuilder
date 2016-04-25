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
      :questions,
      :given_answers,
      :view_count,

      # :users_reached # TODO:
  )
  json.updated_at_words "last seen #{time_ago_in_words(user.updated_at)} ago"
elsif options[:index]
  json.extract!(
    user,
    :id, :display_name, :email, :created_at, :updated_at, :vote_count,
    :reputation, :location
  )

else
  json.extract!(
    user,
    :id, :display_name, :email, :created_at, :updated_at, :vote_count,
      :reputation, :location
  )

  json.created_at_words "#{time_ago_in_words(user.created_at)} ago"
end
