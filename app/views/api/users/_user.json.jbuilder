if options[:stub]
  json.extract!(
    user,
    :id, :display_name, :reputation
  )
else
  json.extract!(
    user,
    :id, :display_name, :email, :created_at, :updated_at, :vote_count, :reputation
  )
end
