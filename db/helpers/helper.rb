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
  if rand < 0.5
    item.upvote(random_user, random_time_ago)
  else
    item.downvote(random_user, random_time_ago)
  end
end

def random_time_ago
  rand(5000000).seconds.ago
end

def random_word
  FFaker::BaconIpsum.word.gsub(/[ \.]/, '-')
end

def create_random_user!
  if @markov
    bio = @markov_user_bio_generator.build_element(400, 5)
  else
    bio = FFaker::BaconIpsum.sentences(rand(15)).join(' ')
  end
  sometime = random_time_ago
  User.create(
    email: FFaker::Internet.email,
    display_name: FFaker::Internet.user_name,
    password: 'hunter2',
    location: random_location,
    updated_at: sometime,
    created_at: sometime,
    bio: bio
  )
end

def create_random_tags!(count)
  if @markov
    tag_names = @scraper.tag_names.sample(count)
    count.times do |idx|
      puts "creating tag ##{idx}"
      begin
        Tag.create!(
        name: tag_names[idx],
        description: @markov_tag_description_generator.build_element(200, 30)
        )
      rescue => e
        if e.message != 'Validation failed: Name has already been taken'
          puts e.message
          debugger
        end
      end
    end
  else
    count.times do |idx|
      puts "creating tag ##{idx}"
      begin
        Tag.create!(
        name: random_word.downcase,
        description: FFaker::DizzleIpsum.sentences(3 + rand(2)).join(' ')
        )
      rescue => e
        if e.message != 'Validation failed: Name has already been taken'
          puts e.message
          debugger
        end
      end
    end
  end
end

def create_random_question!
  if @markov
    title = @markov_question_title_generator.build_element
    content = @markov_question_content_generator.build_element(700, 100)
  else
    title = FFaker::BaconIpsum.sentence
    content = FFaker::BaconIpsum.sentences(rand(15) + 3).join(' ')
  end
  sometime = random_time_ago

  random_user.questions.create!(
    title: title,
    content: content,
    updated_at: sometime,
    created_at: sometime,
    associated_tag_ids: random_tags
  )
end

def toggle_random_favorite!
  sometime = random_time_ago
  user = random_user
  question = random_question
  if favorite = user.favorites.where(question: question).first
    favorite.destroy!
  else
    Favorite.create!(
      user_id: user.id,
      question: question,
      created_at: sometime,
      updated_at: sometime
    )
  end
end

def create_random_answer!
  if @markov
    content = @markov_answer_content_generator.build_element(700, 100)
  else
    content = FFaker::BaconIpsum.sentences(rand(6) + 1).join(' ')
  end
  sometime = random_time_ago
  random_question.answers.create!(
    user: random_user,
    content: content,
    updated_at: sometime,
    created_at: sometime,
  )
end

def create_random_question_comment!
  if @markov
    content = @markov_comment_content_generator.build_element(500, 50)
  else
    content = FFaker::BaconIpsum.sentences(rand(2) + 1).join(' ')
  end
  sometime = random_time_ago
  random_question.comments.create!(
    user: random_user,
    content: content,
    updated_at: sometime,
    created_at: sometime,
  )
end

def create_random_answer_comment!
  if @markov
    content = @markov_comment_content_generator.build_element(500, 50)
  else
    content = FFaker::BaconIpsum.sentences(rand(2) + 1).join(' ')
  end
  sometime = random_time_ago
  random_answer.comments.create!(
    user: random_user,
    content: content,
    updated_at: sometime,
    created_at: sometime,
  )
end

def create_random_vote!(votable)
  begin
    random_vote(votable)
  rescue => e
    if e.message != "Validation failed: User already voted on this!"
      puts e.message
      debugger
    end
  end
end

def create_random_question_vote!
  begin
    random_vote(random_question)
  rescue => e
    if e.message != "Validation failed: User already voted on this!"
      puts e.message
      debugger
    end
  end
end

def create_random_answer_vote!
  begin
    random_vote(random_answer)
  rescue => e
    if e.message != "Validation failed: User already voted on this!"
      puts e.message
      debugger
    end
  end
end

def create_random_comment_vote!
  begin
    random_vote(random_comment)
  rescue => e
    if e.message != "Validation failed: User already voted on this!"
      puts e.message
      debugger
    end
  end
end

def create_random_view!(viewable)
  sometime = random_time_ago
  View.create!(
    user: random_user, viewable: viewable, created_at: sometime,
    updated_at: sometime
  )
end


def create_nontag_badges!
  Badge.SCHEMA[:questions][:views].keys.each do |rank|
    Badge.create!(
      name: Badge.SCHEMA[:questions][:views][rank][:label],
      rank: rank,
      category: 'Question',
      subcategory: 'views',
      description: "Question with #{Badge.SCHEMA[:questions][:views][rank][:criteria]} views or more."
    )
  end

  Badge.SCHEMA[:questions][:votes].keys.each do |rank|
    Badge.create!(
      name: Badge.SCHEMA[:questions][:votes][rank][:label],
      rank: rank,
      category: 'Question',
      subcategory: 'votes',
      description: "Question with score of #{Badge.SCHEMA[:questions][:votes][rank][:criteria]} or more. This badge is still held if future downvotes bring score below score criteria."
    )
  end

  Badge.SCHEMA[:questions][:favorites].keys.each do |rank|
    Badge.create!(
      name: Badge.SCHEMA[:questions][:favorites][rank][:label],
      rank: rank,
      category: 'Question',
      subcategory: 'favorites',
      description: "Question favorited by #{Badge.SCHEMA[:questions][:favorites][rank][:criteria]} or more users."
    )
  end

  Badge.SCHEMA[:answers][:votes].keys.each do |rank|
    Badge.create!(
      name: Badge.SCHEMA[:answers][:votes][rank][:label],
      rank: rank,
      category: 'Answer',
      subcategory: 'votes',
      description: "Answer with score of #{Badge.SCHEMA[:answers][:votes][rank][:criteria]} or more. This badge is still held if future downvotes bring score below score criteria."
    )
  end

  # TODO: may revisit this after confirm basic badges working
  # Badge.create!([
  #   # NOTE: Answers
  #   {
  #     name: 'eager_answerer',
  #     rank: 'bronze',
  #     description: 'First to answer a question.'
  #
  #   }, {
  #     name: 'necromancer',
  #     rank: 'silver',
  #     description: 'Answer score of 5 or higher to a question asked 1 month ago or longer.'
  # }])
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

def setup_markov_scraper
  @scraper = Scraper.new
  @scraper.scrape


  puts "setting up markov_question_title_generator..."
  @markov_question_title_generator =
    MarkovQuestionTitleGenerator.new(@scraper.question_titles)
  @markov_question_title_generator.setup


  puts "setting up markov_question_content_generator..."
  @markov_question_content_generator =
    MarkovTextGenerator.new(@scraper.question_content_elements, 12)
  @markov_question_content_generator.setup


  puts "setting up markov_answer_content_generator..."
  @markov_answer_content_generator =
    MarkovTextGenerator.new(@scraper.answer_content_elements, 12)
  @markov_answer_content_generator.setup

  puts "setting up markov_comment_content_generator..."
  @markov_comment_content_generator =
    MarkovTextGenerator.new(@scraper.comment_content_elements, 12)
  @markov_comment_content_generator.setup

  puts "setting up markov_tag_description_generator..."
  @markov_tag_description_generator =
    MarkovTextGenerator.new(@scraper.tag_description_elements, 8)
  @markov_tag_description_generator.setup


  @markov_user_bio_generator =
    MarkovTextGenerator.new(@scraper.user_bio_elements, 8)
  @markov_user_bio_generator.setup
end

def generate_random_content!
  setup_markov_scraper if @markov

  32.times { |i| puts "creating user #{i}"; create_random_user! }

  # NOTE: the following dates as used DO NOT respect reality (ex: a user can
  # create an answer before joining the site). Will fix this for deployment.
  # random tag creation

  create_random_tags!(60)

  65.times { |i| puts "creating question #{i}"; create_random_question! }
  150.times { |i| puts "creating answer #{i}"; create_random_answer! }
  125.times { |i| puts "creating q_comment #{i}"; create_random_question_comment! }
  400.times { |i| puts "creating a_comment #{i}"; create_random_answer_comment! }
  1000.times { |i| puts "creating q_vote #{i}"; create_random_vote!(random_question) }
  2000.times { |i| puts "creating a_vote #{i}"; create_random_vote!(random_answer) }
  800.times { |i| puts "creating c_vote #{i}"; create_random_vote!(random_comment) }
  500.times { |i| puts "creating q_view #{i}"; create_random_view!(random_question) }
  500.times { |i| puts "creating u_view #{i}"; create_random_view!(random_user) }
  250.times { |i| puts "toggling favorite #{i}"; toggle_random_favorite! }
end
