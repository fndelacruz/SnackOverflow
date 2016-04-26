def random_location
  "#{FFaker::AddressUS.city}, #{FFaker::AddressUS.state_and_territories_abbr}"
end

def question_ids
  @question_ids ||= Question.all.map(&:id)
end

def answer_ids
  @answer_ids ||= Answer.all.map(&:id)
end

def user_ids
  @user_ids ||= User.all.map(&:id)
end

def tag_ids
  @tag_ids ||= Tag.all.map(&:id)
end

def comment_ids
  @comment_ids ||= Comment.all.map(&:id)
end

def random_question
  Question.find(question_ids.sample)
end

def random_answer
  Answer.find(answer_ids.sample)
end

def random_user
  User.find(user_ids.sample)
end

def random_comment
  Comment.find(comment_ids.sample)
end

def random_tags
  tag_ids.sample(rand(6))
end

def random_vote(item)
  rand < 0.5 ? (item.upvote(random_user)) : (item.downvote(random_user))
end

def random_time_ago
  rand(5000000).seconds.ago
end

def random_word
  FFaker::BaconIpsum.word.gsub(/[ \.]/, '_')
end

def create_random_user!
  sometime = random_time_ago
  User.create(
    email: FFaker::Internet.email,
    display_name: FFaker::Internet.user_name,
    password: 'hunter2',
    location: random_location,
    updated_at: sometime,
    created_at: sometime,
    bio: FFaker::BaconIpsum.sentences(rand(15)).join(' ')
  )
end

def create_badges!
  Badge.SCHEMA[:questions][:views].keys.each do |rank|
    Badge.create!(
      name: Badge.SCHEMA[:questions][:views][rank][:label],
      rank: rank,
      description: "Question with #{Badge.SCHEMA[:questions][:views][rank][:criteria]} views or more."
    )
  end

  Badge.SCHEMA[:questions][:votes].keys.each do |rank|
    Badge.create!(
      name: Badge.SCHEMA[:questions][:votes][rank][:label],
      rank: rank,
      description: "Question with score of #{Badge.SCHEMA[:questions][:votes][rank][:criteria]} or more."
    )
  end

  Badge.SCHEMA[:questions][:favorites].keys.each do |rank|
    Badge.create!(
      name: Badge.SCHEMA[:questions][:favorites][rank][:label],
      rank: rank,
      description: "Question favorited by #{Badge.SCHEMA[:questions][:favorites][rank][:criteria]} or more users."
    )
  end

  Badge.SCHEMA[:answers][:votes].keys.each do |rank|
    Badge.create!(
      name: Badge.SCHEMA[:answers][:votes][rank][:label],
      rank: rank,
      description: "Answer with score of #{Badge.SCHEMA[:answers][:votes][rank][:criteria]} or more."
    )
  end

  Badge.create!([
    # NOTE: Questions#favorites
    # {
    #   name: 'favorite_question',
    #   rank: 'bronze',
    #   description: 'Question favorited by 5 users.'
    # }, {
    #   name: 'stellar_question',
    #   rank: 'silver',
    #   description: 'Question favorited by 25 users.'
    # }, {
    #   name: 'ultimate_question',
    #   rank: 'gold',
    #   description: 'Question favorited by 50 users.'

    # NOTE: Answers
    {
      name: 'eager_answerer',
      rank: 'bronze',
      description: 'First to answer a question.'

    }, {
      name: 'necromancer',
      rank: 'silver',
      description: 'Answer score of 5 or higher to a question asked 1 month ago or longer.'

    # NOTE: Tag badges must be dynamically generated when a tag is created!
    # TODO: bronze awarded every 100 tag answer score
    # TODO: silver awarded every 500 tag answer score
    # TODO: gold awarded every 1000 tag answer score
  }])
end

def generate_fixed_content!
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
end

def generate_random_content!
  # random user creation
  25.times { create_random_user! }

  # NOTE: the following dates as used DO NOT respect reality (ex: a user can
  # create an answer before joining the site). Will fix this for deployment.

  # random question creation
  50.times do
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
  300.times do
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
  400.times do
    sometime = random_time_ago
    random_answer.comments.create!(
      user: random_user,
      content: FFaker::BaconIpsum.sentences(rand(2) + 1).join(' '),
      updated_at: sometime,
      created_at: sometime,
    )
  end

  # random question votes
  250.times do
    begin
      random_vote(random_question)
    rescue => e
     debugger unless e.message == "Validation failed: User already voted on this!"
    end
  end

  # random answer votes
  800.times do
    begin
      random_vote(random_answer)
    rescue => e
      debugger unless e.message == "Validation failed: User already voted on this!"
    end
  end

  # random comment votes
  1600.times do
    begin
      random_vote(random_comment)
    rescue => e
      debugger unless e.message == "Validation failed: User already voted on this!"
    end
  end
end
