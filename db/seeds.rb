require_relative 'helper'

ActiveRecord::Base.transaction do
  # random tag creation
  50.times do
    begin
      Tag.create!(
          name: random_word,
          description: FFaker::DizzleIpsum.sentences(3 + rand(2)).join(' ')
        )
    rescue => e
      debugger unless e.message == 'Validation failed: Name has already been taken'
    end
  end

  create_badges!

  ann = User.create!(
    email: 'ann@ann.ann', display_name: 'ann', password: 'annann',
    location: random_location
  )
  bob = User.create!(
    email: 'bob@bob.bob', display_name: 'bob', password: 'bobbob'
  )

  ann_q1 = ann.questions.create!(
    title: FFaker::BaconIpsum.sentence,
    content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    tag_ids: [1, 2]
  )

  Vote.create!(user: bob, votable: ann_q1, value: 1)

  # generate_fixed_content!
  # generate_random_content!

end
