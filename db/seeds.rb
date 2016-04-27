require_relative 'helper'

ActiveRecord::Base.transaction do
  create_nontag_badges!

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
    associated_tag_ids: [1, 2, 3]
  )
  ann_q2 = ann.questions.create!(
    title: FFaker::BaconIpsum.sentence,
    content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    associated_tag_ids: [3, 4, 5]
  )
  ann_q3 = ann.questions.create!(
    title: FFaker::BaconIpsum.sentence,
    content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    associated_tag_ids: [1, 3, 5]
  )
  ann_q1_a1 = ann_q1.answers.create!(
    user: bob,
    content: FFaker::BaconIpsum.sentences(rand(3) + 1).join(' '),
  )
  ann_q3_a1 = ann_q3.answers.create!(
    user: bob,
    content: FFaker::BaconIpsum.sentences(rand(3) + 1).join(' '),
  )

  # 25.times { create_random_user! }

  # 12.times { |x| View.create!(user: User.find(x + 2), viewable: ann_q1 )}
  # 5.times { |x| Vote.create!(user: User.find(x + 2), votable: ann_q1, value: 1 )}
  # 4.times { |x| Vote.create!(user: User.find(x + 2), votable: ann_q2, value: 1 )}
  # 6.times { |x| Vote.create!(user: User.find(x + 2), votable: ann_q3, value: -1 )}
  # 7.times { |x| Vote.create!(user: User.find(x + 2), votable: ann_q1_a1, value: 1 )}
  # 3.times { |x| Vote.create!(user: User.find(x + 2), votable: ann_q3_a1, value: -1 )}
  # 6.times { |x| Favorite.create!(user: User.find(x + 2), question: ann_q1 )}

  # Vote.create!(user: bob, votable: ann_q1, value: 1)

  # generate_fixed_content!
  generate_random_content!

end
