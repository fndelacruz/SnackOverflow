# SnackOverflow

[Live on Heroku!][live]

## Summary

SnackOverflow is a single-page, food-themed Q&A web application inspired by
StackOverflow and built using Ruby on Rails and ReactJS/Flux. By default, seed
entries are procedurally generated using custom Markov Chain models trained with
samples scraped from the Cooking StackExchange.

Non-logged in users can view all application content, but can't contribute. Non-logged in users can:

* Sign up for a new account and subsequently log in / log out
* Log in using a guest account
* Search questions and answers for relevant content
* Filter questions by tag
* Search for and visit user profiles to view detailed history and statistics
* Access a badge directory with statistics and award dates

In addition to the above, logged-in users can:

* Ask food-related questions with tags (optional) to help categorize questions
* Create and describe new tags
* Mark a question as a "Favorite" for easy bookmarking
* Answer questions
* Post comments to questions and answers
* Edit and delete owned questions, answers, and comments
* Moderate content by casting up- or down- votes on questions, answers, and comments
* Earn reputation points and badges for making quality (upvoted) posts
* Spend reputation points to downvote "bad" answers
* Get notifications for new posts to owned questions and answers

## Structure

#### Back end

SnackOverflow's foundation RESTs on a JSON API served by Ruby on Rails using a
PostgreSQL database. Extensive use of joins and associations prevents N+1
database queries. Polymorphic associations and concerns help keep codebase DRY.

#### Front end

The front end is built completely using ReactJS with the Flux architecture. AJAX
requests eliminate the need for serving static pages, enabling ReactJS to render
views client-side using a virtual DOM with unparalleled speed.

#### Seed data

By default, seed data is procedurally generated using Markov Models trained by
posts from the Cooking StackExchange. HTTParty fetches HTML pages to be parsed
with Nokogiri into arrays of relevant content.

Optionally, seed data may be purely randomly generated using the FFaker gem by
setting @markov to false in [seeds.rb][seeds]. This seeding option is faster and
handy when debugging issues unrelated to seed data.

## To do:

* Tag favorites/ignores to filter logged-in users questions' feed
* Make search engine more robust to handle several search conditions
* Log in using gmail, facebook (OAuth)

[live]: http://www.snackoverflow.xyz
[seeds]: https://github.com/fndelacruz/SnackOverflow/blob/master/db/seeds.rb
