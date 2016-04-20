json.array!(@users) do |user|
  json.partial!('user', user: user, show_detail: false)
end
