json.extract!(@current_user,
  :id, :display_name
)

json.reputation @current_user.reputation
