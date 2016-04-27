json.array!(@badges) do |badge|
  json.partial!('badge', badge: badge)
  json.extract!(
    badge,
    :badgings_count, :category, :subcategory
  )
end
