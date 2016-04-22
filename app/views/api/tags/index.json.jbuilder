json.array!(@tags) do |tag|
  json.partial!('tag', tag: tag, options: { index: true })
end
