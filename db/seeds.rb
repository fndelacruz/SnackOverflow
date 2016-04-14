ActiveRecord::Base.transaction do
  tag1 = Tag.create!(name: 'tag1')
  tag2 = Tag.create!(name: 'tag2')
  tag3 = Tag.create!(name: 'tag3')
  tag4 = Tag.create!(name: 'tag4')

  ann = User.create!(
    email: 'ann@ann.ann', display_name: 'ann1', password: 'annann'
  )
  bob = User.create!(
    email: 'bob@bob.bob', display_name: 'bob1', password: 'bobbob'
  )
  cal = User.create!(
    email: 'cal@cal.cal', display_name: 'cal1', password: 'calcal'
  )
  dan = User.create!(
    email: 'dan@dan.dan', display_name: 'dan1', password: 'dandan'
  )

  ann_q1 = ann.questions.create!(
    title: 'Why is my name ann?',
    content: 'I need to know!',
    tag_ids: [1, 2]
  )
  ann_q2 = ann.questions.create!(
    title: 'How many other people are named ann?',
    content: 'I only know of myself',
    tag_ids: []
  )
  bob_q1 = bob.questions.create!(
    title: 'Does anyone else like my name, bob?',
    content: 'Just wondering.',
    tag_ids: [2, 4]
  )

  ann_q1.answers.create!(user: bob, content: 'Because your parents named you.')
  ann_q1.answers.create!(user: bob, content: 'Because it just is.')
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

  cal_a1.upvote(cal)
  cal_a1.upvote(bob)
  cal_a1.upvote(dan)

  ann_c1.upvote(ann)
  ann_c1.upvote(dan)

  View.create!(viewable: ann_q1, user: ann, created_at: 1.hour.ago, updated_at: 1.hour.ago)
  View.create!(viewable: ann_q1, user: ann)
end
