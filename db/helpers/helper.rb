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

def random_vote(votable)
  if rand < 0.5
    votable.upvote!(random_user, random_time_ago)
  else
    votable.downvote!(random_user, random_time_ago)
  end
end

def random_time_ago
  rand(5000000).seconds.ago
end

def random_word
  FFaker::BaconIpsum.word.gsub(/[ \.]/, '-')
end

def create_random_user!(markov_options=nil)
  if @markov
    bio = markov_options[:content].build_element(400, 5)
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

    puts "setting up markov_tag_description_generator..."
    markov_tag_description_generator =
      MarkovTextGenerator.new(@scraper.tag_descriptions, 6)
    markov_tag_description_generator.setup

    count.times do |idx|
      puts "creating tag ##{idx}"
      begin
        Tag.create!(
          name: tag_names[idx],
          description: markov_tag_description_generator.build_element(200, 30)
        )
      rescue => e
        if e.message != 'Validation failed: Name has already been taken'
          puts e.message
          debugger
        end
      end
    end

    @scraper.tag_names = nil
    @scraper.tag_descriptions = nil
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

def create_random_question!(markov_options=nil)
  if markov_options
    title = markov_options[:title].build_element
    content = markov_options[:content].build_element(700, 100)
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

def create_random_answer!(markov_options=nil)
  if markov_options
    content = markov_options[:content].build_element(700, 100)
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

def create_random_question_comment!(markov_options=nil)
  if @markov
    content = markov_options[:content].build_element(500, 50)
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

def create_random_answer_comment!(markov_options={})
  if @markov
    content = markov_options[:content].build_element(500, 50)
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

def setup_markov_scraper
  @scraper = Scraper.new
  @scraper.scrape
end

def generate_random_content!
  setup_markov_scraper if @markov

  create_random_users!(32)
  create_random_tags!(60)
  create_random_questions!(93)
  create_random_answers!(150)
  create_random_comments!(175, 400)

  1000.times { |i| puts "creating q_vote #{i}"; create_random_vote!(random_question) }
  2000.times { |i| puts "creating a_vote #{i}"; create_random_vote!(random_answer) }
  800.times { |i| puts "creating c_vote #{i}"; create_random_vote!(random_comment) }
  500.times { |i| puts "creating q_view #{i}"; create_random_view!(random_question) }
  500.times { |i| puts "creating u_view #{i}"; create_random_view!(random_user) }
  250.times { |i| puts "toggling favorite #{i}"; toggle_random_favorite! }
end

def create_random_users!(num)
  if @markov
    puts "setting up markov_user_bio_generator..."
    markov_user_bio_generator =
      MarkovTextGenerator.new(@scraper.user_bio_contents, 9)
    markov_user_bio_generator.setup
  end

  num.times do |i|
    puts "creating user #{i}"
    if @markov
      create_random_user!(content: markov_user_bio_generator)
    else
      create_random_user!
    end
  end

  if @markov
    @scraper.user_bio_contents = nil
  end
end

def create_random_questions!(num)
  if @markov
    puts "setting up markov_question_title_generator..."
    markov_question_title_generator =
      MarkovQuestionTitleGenerator.new(@scraper.question_titles, 7)
    markov_question_title_generator.setup

    puts "setting up markov_question_content_generator..."
    markov_question_content_generator =
      MarkovTextGenerator.new(@scraper.question_contents, 9)
    markov_question_content_generator.setup
  end

  num.times do |i|
    puts "creating question #{i}"
    if @markov
      create_random_question!(
        title: markov_question_title_generator,
        content: markov_question_content_generator
      )
    else
      create_random_question!
    end
  end

  if @markov
    @scraper.question_titles = nil
    @scraper.question_contents = nil
  end
end

def create_random_answers!(num)
  if @markov
    puts "setting up markov_answer_content_generator..."
    markov_answer_content_generator =
      MarkovTextGenerator.new(@scraper.answer_contents, 9)
    markov_answer_content_generator.setup
  end

  num.times do |i|
    puts "creating answer #{i}"
    if @markov
      create_random_answer!(content: markov_answer_content_generator)
    else
      create_random_answer!
    end
  end

  if @markov
    @scraper.answer_contents = nil
  end
end

def create_random_comments!(num_question, num_answer)
  if @markov
    puts "setting up markov_comment_content_generator..."
    markov_comment_content_generator =
      MarkovTextGenerator.new(@scraper.comment_contents, 9)
    markov_comment_content_generator.setup
  end

  num_question.times do |i|
    puts "creating question comment #{i}"
    if @markov
      create_random_question_comment!(content: markov_comment_content_generator)
    else
      create_random_question_comment!
    end
  end

  num_answer.times do |i|
    puts "creating answer comment #{i}"
    if @markov
      create_random_answer_comment!(content: markov_comment_content_generator)
    else
      create_random_answer_comment!
    end
  end

  if @markov
    @scraper.comment_contents = nil
  end
end
