json.array!(@users) do |user|
  json.partial!('user', user: user, options: { index: true })
  # json.extract!(user,
  #   :id, :display_name, :tags
  # )
  # json.reputation user.sql_reputation
end
