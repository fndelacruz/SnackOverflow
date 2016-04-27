json.extract!(
  badging,
  :id, :user_id, :badgeable_type, :badgeable_id, :created_at
)

json.badge { json.partial!('/api/badges/badge', badge: badging.badge) }
