ActiveRecord::Base.transaction do
  tag1 = Tag.create!(name: 'tag1')
  tag2 = Tag.create!(name: 'tag2')
  tag3 = Tag.create!(name: 'tag3')
  tag4 = Tag.create!(name: 'tag4')

  ann = User.create!(
    email: 'ann@ann.ann', display_name: 'ann', password: 'annann'
  )
  bob = User.create!(
    email: 'bob@bob.bob', display_name: 'bob', password: 'bobbob'
  )
  cal = User.create!(
    email: 'cal@cal.cal', display_name: 'cal', password: 'calcal'
  )
  dan = User.create!(
    email: 'dan@dan.dan', display_name: 'dan', password: 'dandan'
  )
  edd = User.create!(
    email: 'edd@edd.edd', display_name: 'edd', password: 'eddedd'
  )
  fry = User.create!(
    email: 'fry@fry.fry', display_name: 'fry', password: 'fryfry'
  )
  guy = User.create!(
    email: 'guy@guy.guy', display_name: 'guy', password: 'guyguy'
  )
  hal = User.create!(
    email: 'hal@hal.hal', display_name: 'hal', password: 'halhal'
  )

  ann_q1 = ann.questions.create!(
    title: FFaker::BaconIpsum.sentence,
    content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    tag_ids: [1, 2]
  )
  ann_q2 = ann.questions.create!(
    title: FFaker::BaconIpsum.sentence,
    content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    tag_ids: []
  )
  bob_q1 = bob.questions.create!(
    title: FFaker::BaconIpsum.sentence,
    content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    tag_ids: [2, 4]
  )
  bob_q2 = bob.questions.create!(
    title: FFaker::BaconIpsum.sentence,
    content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    tag_ids: [1, 4]
  )
  bob_q3 = bob.questions.create!(
    title: FFaker::BaconIpsum.sentence,
    content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    tag_ids: [1, 4]
  )
  dan_q1 = dan.questions.create!(
    title: FFaker::BaconIpsum.sentence,
    content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    tag_ids: [1, 4]
  )

  20.times do
    dan.questions.create!(
      title: FFaker::BaconIpsum.sentence,
      content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    )
  end


  ann_q1_a1 = ann_q1.answers.create!(user: bob, content: 'Because your parents named you.')
  ann_q1_a2 = ann_q1.answers.create!(user: bob, content: 'Because it just is.')
  ann_q1_a3 = ann_q1.answers.create!(user: cal, content: 'hi there.')
  ann_q2.answers.create!(user: bob, content: "My mom's name is Ann.")
  cal_a1 = ann_q2.answers.create!(user: cal, content: "I know 3 Ann's. It's common!")
  bob_q1.answers.create!(user: ann, content: "Nope. I don't like it.")
  bob_q1.answers.create!(user: cal, content: "I like my name better.")
  bob_q1.answers.create!(user: dan, content: "It's ok.")

  ann_c1 = ann_q1.comments.create!(user: ann, content: 'By the way, hello!' )
  ann_q1.comments.create!(user: cal, content: 'I think ann is a fine name.' )
  ann_q1.answers[0].comments.create!(user: ann, content: 'I guess they did.' )
  cal_a1.comments.create!(user: ann, content: "It's not that common." )
  cal_a1.comments.create!(user: bob, content: "Yes, it is common." )
  cal_a1.comments.create!(user: ann, content: "If you say so." )

  ann_q1.comments.create!(user: ann, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  ann_q1.comments.create!(user: dan, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  ann_q1.comments.create!(user: fry, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  ann_q1.comments.create!(user: guy, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  ann_q1.comments.create!(user: hal, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  ann_q1.comments.create!(user: bob, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )

  ann_q1.add_favorite(ann)
  ann_q1.add_favorite(bob)
  bob_q1.add_favorite(bob)
  bob_q1.add_favorite(cal)
  bob_q1.add_favorite(dan)

  ann_q1.upvote(ann)
  ann_q1.upvote(bob)
  ann_q1.upvote(cal)
  ann_q1.downvote(dan)
  ann_q2.upvote(ann)

  ann_q2.downvote(bob)
  ann_q2.downvote(cal)
  ann_q2.downvote(dan)
  ann_q2.upvote(edd)

  cal_a1.upvote(cal)
  cal_a1.upvote(bob)
  cal_a1.upvote(dan)

  ann_q1.comments[0].upvote(ann)
  ann_q1.comments[0].upvote(bob)
  ann_q1.comments[0].upvote(cal)
  ann_q1.comments[0].upvote(dan)
  ann_q1.comments[0].downvote(fry)
  ann_q1.comments[0].upvote(guy)

  bob_q3.upvote(ann)
  bob_q3.upvote(bob)
  bob_q3.upvote(cal)
  bob_q3.upvote(dan)
  bob_q3.upvote(edd)
  bob_q3.upvote(fry)
  bob_q3.upvote(guy)
  bob_q3.upvote(hal)

  View.create!(viewable: ann_q1, user: ann, created_at: 1.hour.ago, updated_at: 1.hour.ago)
  View.create!(viewable: ann_q1, user: ann)
  View.create!(viewable: bob_q3, user: ann)
  View.create!(viewable: bob_q3, user: bob)
  View.create!(viewable: bob_q3, user: cal)
  View.create!(viewable: bob_q2, user: cal)
  View.create!(viewable: dan_q1, user: ann)
  View.create!(viewable: dan_q1, user: bob)
  View.create!(viewable: dan_q1, user: cal)
  View.create!(viewable: dan_q1, user: dan)
  View.create!(viewable: dan_q1, user: edd)
  View.create!(viewable: dan_q1, user: fry)
  View.create!(viewable: dan_q1, user: guy)
  View.create!(viewable: dan_q1, user: hal)

  ann_q1_a1.upvote(ann)
  ann_q1_a1.upvote(bob)
  ann_q1_a2.upvote(ann)
  ann_q1_a2.upvote(bob)
  ann_q1_a2.upvote(cal)
  ann_q1_a2.upvote(dan)
  ann_q1_a3.downvote(ann)
  ann_q1_a3.downvote(bob)
  ann_q1_a3.downvote(cal)
  ann_q1_a3.downvote(dan)
end
