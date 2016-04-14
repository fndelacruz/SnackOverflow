## User
- for asked questions
  - User#questions, User#received_answers, User#answer_givers
- for answered questions
  - User#given_answers, User#answer_receivers
- User#comments
- User#favorite_questions
- User#view_count

- cascade destroy on #questions, #given_answers, #comments

## Question
- Question#user, Question#answers, Question#responders
- Question#comments
- Question#tags
- Question#add_favorite, Question#remove_favorite,
- Question#favorite_users
- Question#upvote, Question#downvote, Question#cancel_vote, Question#score
- Question#view_count

- cascade destroy on #comments, #answers, #taggings

## Answer
- Answer#user, Answer#question
- Answer#comments
- Answer#upvote, Answer#downvote, Answer#cancel_vote, Answer#score

- cascade destroy on #comments

## Comment
- Comment#user, Comment#commentable
- Question#upvote, Question#downvote
- Answer#upvote, Answer#downvote, Answer#cancel_vote, Answer#score

## Tagging

## Tag

## Favorite

## Vote
- test concerns

## View
- test view create limit to once per 5 minutes
