json.extract!(@user, :id, :display_name, :email, :created_at, :updated_at,
  :votes, :bio, :reputation, :location, :tags, :view_count, :vote_count
)

json.questions do
  json.array!(@questions) do |question|
    json.extract!(question, :id, :title, :created_at, :vote_count )
  end
end

json.given_answers do
  json.array!(@given_answers) do |answer|
    json.extract!(answer, :id, :created_at, :question_id, :vote_count)
    json.title answer.question.title
  end
end

json.badgings do
  json.array!(@badgings) do |badging|
    json.extract!(badging, :id, :created_at)
    json.badge { json.partial!('/api/badges/badge', badge: badging.badge) }
  end
end

json.updated_at_words "last seen #{time_ago_in_words(@user.updated_at)} ago"
