require_relative 'helper'

# ActiveRecord::Base.transaction do
  # random tag creation
  50.times do
    begin
      Tag.create!(
          name: FFaker::BaconIpsum.word,
          description: FFaker::DizzleIpsum.sentence
        )
    rescue => e
      debugger unless e.message == 'Validation failed: Name has already been taken'
    end
  end

  ann = User.create!(
    email: 'ann@ann.ann', display_name: 'ann', password: 'annann',
    location: random_location
  )
  # bob = User.create!(
  #   email: 'bob@bob.bob', display_name: 'bob', password: 'bobbob',
  #   location: random_location
  # )
  # cal = User.create!(
  #   email: 'cal@cal.cal', display_name: 'cal', password: 'calcal',
  #   location: random_location
  # )
  # dan = User.create!(
  #   email: 'dan@dan.dan', display_name: 'dan', password: 'dandan',
  #   location: random_location
  # )
  # edd = User.create!(
  #   email: 'edd@edd.edd', display_name: 'edd', password: 'eddedd',
  #   location: random_location
  # )
  # fry = User.create!(
  #   email: 'fry@fry.fry', display_name: 'fry', password: 'fryfry',
  #   location: random_location
  # )
  # guy = User.create!(
  #   email: 'guy@guy.guy', display_name: 'guy', password: 'guyguy',
  #   location: random_location
  # )
  # hal = User.create!(
  #   email: 'hal@hal.hal', display_name: 'hal', password: 'halhal',
  #   location: random_location
  # )
  #
  # ann_q1 = ann.questions.create!(
  #   title: FFaker::BaconIpsum.sentence,
  #   content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
  #   tag_ids: [1, 2]
  # )
  # ann_q2 = ann.questions.create!(
  #   title: FFaker::BaconIpsum.sentence,
  #   content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
  #   tag_ids: []
  # )
  # bob_q1 = bob.questions.create!(
  #   title: FFaker::BaconIpsum.sentence,
  #   content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
  #   tag_ids: [2, 4]
  # )
  # bob_q2 = bob.questions.create!(
  #   title: FFaker::BaconIpsum.sentence,
  #   content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
  #   tag_ids: [1, 4]
  # )
  # bob_q3 = bob.questions.create!(
  #   title: FFaker::BaconIpsum.sentence,
  #   content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
  #   tag_ids: [1, 4]
  # )
  # dan_q1 = dan.questions.create!(
  #   title: FFaker::BaconIpsum.sentence,
  #   content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
  #   tag_ids: [1, 4]
  # )
  #
  #
  # ann_q1_a1 = ann_q1.answers.create!(user: bob, content: 'Because your parents named you.')
  # ann_q1_a2 = ann_q1.answers.create!(user: bob, content: 'Because it just is.')
  # ann_q1_a3 = ann_q1.answers.create!(user: cal, content: 'hi there.')
  # ann_q1_a4 = ann_q1.answers.create!(user: ann, content: 'Here I answer my own question.')
  # ann_q2.answers.create!(user: bob, content: "My mom's name is Ann.")
  # cal_a1 = ann_q2.answers.create!(user: cal, content: "I know 3 Ann's. It's common!")
  # bob_q1.answers.create!(user: ann, content: "Nope. I don't like it.")
  # bob_q1.answers.create!(user: cal, content: "I like my name better.")
  # bob_q1.answers.create!(user: dan, content: "It's ok.")
  #
  # ann_c1 = ann_q1.comments.create!(user: ann, content: 'By the way, hello!' )
  # ann_q1.comments.create!(user: cal, content: 'I think ann is a fine name.' )
  # ann_q1.answers[0].comments.create!(user: ann, content: 'I guess they did.' )
  # cal_a1.comments.create!(user: ann, content: "It's not that common." )
  # cal_a1.comments.create!(user: bob, content: "Yes, it is common." )
  # cal_a1.comments.create!(user: ann, content: "If you say so." )
  #
  # ann_q1.comments.create!(user: ann, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  # ann_q1.comments.create!(user: dan, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  # ann_q1.comments.create!(user: fry, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  # ann_q1.comments.create!(user: guy, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  # ann_q1.comments.create!(user: hal, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  # ann_q1.comments.create!(user: bob, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  #
  # ann_q1.answers[0].comments.create!(user: guy, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  # ann_q1.answers[0].comments.create!(user: hal, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  # ann_q1.answers[0].comments.create!(user: bob, content: FFaker::BaconIpsum.sentences(rand(5) + 3).join(' ') )
  #
  # ann_q1.add_favorite(ann)
  # ann_q1.add_favorite(bob)
  # bob_q1.add_favorite(bob)
  # bob_q1.add_favorite(cal)
  # bob_q1.add_favorite(dan)
  #
  # ann_q1.upvote(ann)
  # ann_q1.upvote(bob)
  # ann_q1.upvote(cal)
  # ann_q1.downvote(dan)
  # ann_q2.upvote(ann)
  #
  # ann_q2.downvote(bob)
  # ann_q2.downvote(cal)
  # ann_q2.downvote(dan)
  # ann_q2.upvote(edd)
  #
  # cal_a1.upvote(cal)
  # cal_a1.upvote(bob)
  # cal_a1.upvote(dan)
  #
  # ann_q1.comments[2].upvote(ann)
  # ann_q1.comments[2].upvote(bob)
  # ann_q1.comments[2].upvote(cal)
  # ann_q1.comments[2].upvote(dan)
  # ann_q1.comments[2].upvote(edd)
  # ann_q1.comments[2].downvote(fry)
  # ann_q1.comments[2].upvote(guy)
  # ann_q1.comments[3].upvote(ann)
  # ann_q1.comments[3].upvote(cal)
  # ann_q1.comments[3].upvote(guy)
  # ann_q1.comments[4].upvote(bob)
  # ann_q1.comments[4].upvote(dan)
  #
  #
  # View.create!(viewable: ann_q1, user: ann, created_at: 1.hour.ago, updated_at: 1.hour.ago)
  # View.create!(viewable: ann_q1, user: ann)
  # View.create!(viewable: bob_q3, user: ann)
  # View.create!(viewable: bob_q3, user: bob)
  # View.create!(viewable: bob_q3, user: cal)
  # View.create!(viewable: bob_q2, user: cal)
  # View.create!(viewable: dan_q1, user: ann)
  # View.create!(viewable: dan_q1, user: bob)
  # View.create!(viewable: dan_q1, user: cal)
  # View.create!(viewable: dan_q1, user: dan)
  # View.create!(viewable: dan_q1, user: edd)
  # View.create!(viewable: dan_q1, user: fry)
  # View.create!(viewable: dan_q1, user: guy)
  # View.create!(viewable: dan_q1, user: hal)

  # random user creation
  users = 100.times.map do
    sometime = random_time_ago
    {
      email: FFaker::Internet.email,
      display_name: FFaker::Internet.user_name,
      password: 'hunter2',
      location: random_location,
      updated_at: sometime,
      created_at: sometime,
    }
  end
  User.create!(users)

  # NOTE: the following dates as used DO NOT respect reality (ex: a user can
  # create an answer before joining the site). Will fix this for deployment.

  # random question creation
  25.times do
    sometime = random_time_ago
    random_user.questions.create!(
      title: FFaker::BaconIpsum.sentence,
      content: FFaker::BaconIpsum.sentences(rand(15) + 3).join(' '),
      updated_at: sometime,
      created_at: sometime,
      tag_ids: random_tags
    )
  end

  # random answer creation
  100.times do
    sometime = random_time_ago
    random_question.answers.create!(
      user: random_user,
      content: FFaker::BaconIpsum.sentences(rand(6) + 1).join(' '),
      updated_at: sometime,
      created_at: sometime,
    )
  end

  # random question comment creation
  50.times do
    sometime = random_time_ago
    random_question.comments.create!(
      user: random_user,
      content: FFaker::BaconIpsum.sentences(rand(2) + 1).join(' '),
      updated_at: sometime,
      created_at: sometime,
    )
  end

  # random answer comment creation
  200.times do
    sometime = random_time_ago
    random_answer.comments.create!(
      user: random_user,
      content: FFaker::BaconIpsum.sentences(rand(2) + 1).join(' '),
      updated_at: sometime,
      created_at: sometime,
    )
  end

  # random question votes
  200.times do
    begin
      random_vote(random_question)
    rescue => e
     debugger unless e.message == "Validation failed: User already voted on this!"
    end
  end

  # random answer votes
  400.times do
    begin
      random_vote(random_answer)
    rescue => e
      debugger unless e.message == "Validation failed: User already voted on this!"
    end
  end

  # random comment votes
  800.times do
    begin
      random_vote(random_comment)
    rescue => e
      debugger unless e.message == "Validation failed: User already voted on this!"
    end
  end

# end
