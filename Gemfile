source 'https://rubygems.org'


# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.2.6'
# Use postgresql as the database for Active Record
gem 'pg', '~> 0.15'
# Use SCSS for stylesheets
gem 'sass-rails', '~> 5.0'
# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'
# Use CoffeeScript for .coffee assets and views
gem 'coffee-rails', '~> 4.1.0'
# See https://github.com/rails/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.0'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Use ActiveModel has_secure_password
gem 'bcrypt'


# Use Capistrano for deployment
# gem 'capistrano-rails', group: :development
gem 'ffaker'
gem 'active_record_union'

gem 'figaro'

# for scraping content for markov based seed generator
gem 'httparty'
gem 'nokogiri'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug'

  gem 'pry-rails'

  # RSpec/Capybara testing with selenium
  gem 'capybara'
  gem 'selenium-webdriver', '2.53.4'
  gem 'rspec-rails'
  gem 'launchy'
  gem 'factory_girl_rails'
end

group :test do
  gem 'database_cleaner'
  gem 'shoulda-matchers'
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'

  gem 'better_errors'
  gem 'binding_of_caller'
  gem 'annotate'
  gem 'quiet_assets'
end

group :production do
  gem 'newrelic_rpm'
end
