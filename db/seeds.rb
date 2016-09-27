require_relative './helpers/helper'
require_relative './helpers/markov_question_title_generator'
require_relative './helpers/markov_text_generator'
require_relative './helpers/scraper'

include ActionView::Helpers::SanitizeHelper

create_nontag_badges!

ann = User.create!(
  email: 'ann@ann.ann', display_name: 'ann', password: 'annann',
  location: random_location
)
bob = User.create!(
  email: 'bob@bob.bob', display_name: 'bob', password: 'bobbob'
)

@markov = true
generate_random_content!
