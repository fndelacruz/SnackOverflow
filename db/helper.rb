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

def random_question
  Question.find(question_ids.sample)
end

def random_answer
  Answer.find(answer_ids.sample)
end

def random_user
  User.find(user_ids.sample)
end

def random_vote(item)
  rand < 0.5 ? (item.upvote(random_user)) : (item.downvote(random_user))
end
