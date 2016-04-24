json.array!(@users) do |user|
  json.partial!('user', user: user, options: { index: true })
end
