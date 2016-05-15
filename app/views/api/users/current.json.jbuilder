json.extract!(@current_user,
  :id, :display_name, :bio, :location, :reputation, :email
)

json.notifications @notifications do |notification|
  json.extract!(notification, :id, :question_id, :title, :content, :created_at,
    :unread, :category)
end
