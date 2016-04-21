require_relative 'helper'

# ActiveRecord::Base.transaction do
  tag1 = Tag.create!(name: 'tag1')
  tag2 = Tag.create!(name: 'tag2')
  tag3 = Tag.create!(name: 'tag3')
  tag4 = Tag.create!(name: 'tag4')

  ann = User.create!(
    email: 'ann@ann.ann', display_name: 'ann', password: 'annann',
    location: random_location
  )
  bob = User.create!(
    email: 'bob@bob.bob', display_name: 'bob', password: 'bobbob',
    location: random_location
  )
  cal = User.create!(
    email: 'cal@cal.cal', display_name: 'cal', password: 'calcal',
    location: random_location
  )
  dan = User.create!(
    email: 'dan@dan.dan', display_name: 'dan', password: 'dandan',
    location: random_location
  )
  edd = User.create!(
    email: 'edd@edd.edd', display_name: 'edd', password: 'eddedd',
    location: random_location
  )
  fry = User.create!(
    email: 'fry@fry.fry', display_name: 'fry', password: 'fryfry',
    location: random_location
  )
  guy = User.create!(
    email: 'guy@guy.guy', display_name: 'guy', password: 'guyguy',
    location: random_location
  )
  hal = User.create!(
    email: 'hal@hal.hal', display_name: 'hal', password: 'halhal',
    location: random_location
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

  users = 100.times.map do
    {
      email: FFaker::Internet.email,
      display_name: FFaker::Internet.user_name,
      password: 'hunter2',
      location: random_location,
      created_at: rand(50000000).seconds.ago 
    }
  end
  User.create!(users)

  50.times do
    dan.questions.create!(
      title: FFaker::BaconIpsum.sentence,
      content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    )
  end


  ann_q1_a1 = ann_q1.answers.create!(user: bob, content: 'Because your parents named you.')
  ann_q1_a2 = ann_q1.answers.create!(user: bob, content: 'Because it just is.')
  ann_q1_a3 = ann_q1.answers.create!(user: cal, content: 'hi there.')
  ann_q1_a4 = ann_q1.answers.create!(user: ann, content: 'Here I answer my own question.')
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

  ann_q1.answers[0].comments.create!(user: guy, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  ann_q1.answers[0].comments.create!(user: hal, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  ann_q1.answers[0].comments.create!(user: bob, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )

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

  ann_q1.comments[2].upvote(ann)
  ann_q1.comments[2].upvote(bob)
  ann_q1.comments[2].upvote(cal)
  ann_q1.comments[2].upvote(dan)
  ann_q1.comments[2].upvote(edd)
  ann_q1.comments[2].downvote(fry)
  ann_q1.comments[2].upvote(guy)
  ann_q1.comments[3].upvote(ann)
  ann_q1.comments[3].upvote(cal)
  ann_q1.comments[3].upvote(guy)
  ann_q1.comments[4].upvote(bob)
  ann_q1.comments[4].upvote(dan)


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

  # random question creation
  50.times do
    random_user.questions.create!(
      title: FFaker::BaconIpsum.sentence,
      content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
    )
  end

  # random answer creation
  50.times do
    random_question.answers.create!(
      user: random_user,
      content: FFaker::BaconIpsum.sentences(rand(5) + 1).join(' ')
    )
  end

  # random question votes
  50.times do
    random_vote(random_question)
  end

  # random answer votes
  50.times do
    random_vote(random_answer)
  end

# end

# random_question.answers.create!(user: random_user, content: FFaker::BaconIpsum.sentences(rand(5) + rand(3)).join(' '))
