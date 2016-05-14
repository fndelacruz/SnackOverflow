json.array!(@posts) do |post|
  json.extract!(post, :id, :title, :content, :created_at, :vote_count, :matches)

  if post.is_a?(Question)
    json.answer_count post.answer_count
    json.view_count post.view_count
  else
    json.question_id post.question_id
  end

  json.user do
    json.id post.user_id
    json.display_name @users_hash[post.user_id].display_name
    json.reputation @users_hash[post.user_id].reputation
  end

  json.tags post.associated_tags, :id, :name
end
