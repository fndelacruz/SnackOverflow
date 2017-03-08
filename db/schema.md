# Schema Information

## users
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
email           | string    | not null, indexed, unique
display_name    | string    | not null
password_digest | string    | not null
bio             | text      |
location        | string    |
created_at      | datetime  | not null
updated_at      | datetime  | not null

## questions
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed
title           | string    | not null
content         | text      | not null
created_at      | datetime  | not null
updated_at      | datetime  | not null

## answers
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed
question_id     | integer   | not null, foreign key (ref: questions), indexed
content         | text      | not null
created_at      | datetime  | not null
updated_at      | datetime  | not null

## comments (polymorphic: questions, answers)
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed
commentable_id  | integer   | not null, indexed
commentable_type| string    | not null, indexed
content         | text      | not null
created_at      | datetime  | not null
updated_at      | datetime  | not null

## taggings
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
question_id     | integer   | not null, foreign key (ref: questions), indexed, unique [question_id, tag_id]
tag_id          | text      | not null, foreign_key (ref: tags), indexed

## tags
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
name            | string    | not null

## favorites
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed, unique [question_id]
question_id     | integer   | not null, foreign key (ref: questions), indexed
created_at      | datetime  | not null


## votes (polymorhpic: questions, answers, comments)
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed, unique [votable_type, votable_id]
votable_type    | string    | not null, indexed
votable_id      | integer   | not null, indexed
value           | integer   | not null
created_at      | datetime  | not null

## views (polymorphic: questions, users)
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed [viewable_type, viewable_id]
viewable_type   | string    | not null, indexed
viewable_id     | integer   | not null, indexed
created_at      | datetime  | not null

## badges
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
name            | string    | not null, unique
description     | text      | not null, indexed

## badgings (polymorphic: questions, answers, tags)
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed
badge_id        | integer   | not null, foreign key (ref: badges), indexed
created_at      | datetime  | not null
badgeable_type  | string    | not indexed
badgeable_id    | integer   | not indexed

NOTE: badgeable is not required since some badges do not require an associated
entry, ex: badge for voting 300 times

## Bonus content

## tag_subscriptions
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed
tag_id          | integer   | not null, foreign key (ref: tags), indexed


## user_visits
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed
created_at      | datetime  | not null

## notifications (polymorphic: questions, answers, tags, comments)
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed
created_at      | datetime  | not null

## other_user_edits (polymorhpic: questions, comments, answers)
column name     | data type | details
----------------|-----------|-----------------------
id              | integer   | not null, primary key
user_id         | integer   | not null, foreign key (ref: users), indexed
votable_type    | string    | not null, indexed
votable_id      | integer   | not null, indexed
old_title       | string    |
new_title       | string    |
old_content     | text      | not null
new_content     | text      | not null
created_at      | datetime  | not null
