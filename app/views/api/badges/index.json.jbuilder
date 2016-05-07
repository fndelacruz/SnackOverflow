json.array!(@badges) do |badge|
  json.extract!(badge, :id, :name, :rank, :description, :badgings_count,
    :category, :subcategory
  )
end
