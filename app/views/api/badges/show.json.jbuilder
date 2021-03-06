json.extract!(@badge, :id, :name, :rank, :description, :category, :subcategory)
json.badgings_count @badgings.length

json.badgings do
  json.array!(@badgings) do |badging|
    json.extract!(badging, :id, :user_id, :badgeable_type, :badgeable_id,
      :created_at, :title, :question_id, :user_display_name)
    json.created_at_words "Awarded #{time_ago_in_words(badging.created_at).gsub(/^about /, '')} ago"
    json.user_reputation @users_reputation[badging.user_id].reputation
  end
end
