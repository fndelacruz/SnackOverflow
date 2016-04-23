if options[:stub]
  json.extract!(
    user,
    :id, :display_name, :reputation
  )
elsif options[:show]
  json.extract!(
    user,
    :id, :display_name, :email, :created_at, :updated_at, :vote_count, :bio,
      :reputation, :location,
      :questions,
      :given_answers,
      # :users_reached # TODO:
  )
else
  json.extract!(
    user,
    :id, :display_name, :email, :created_at, :updated_at, :vote_count,
      :reputation, :location
  )

  json.created_at_words "#{time_ago_in_words(user.created_at)} ago"
end
