json.array!(@users) do |user|
  json.extract!(user,
    :id, :display_name, :location, :created_at, :tags, :vote_count, :reputation
  )
end
