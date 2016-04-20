json.extract!(
  user,
  :id, :display_name, :email, :created_at, :updated_at, :vote_count, :reputation
)

if show_detail
  # NOTE: this is already extracted without show_detail...
  # json.extract!(
  #   user,
  #   :vote_count
  # )
end
