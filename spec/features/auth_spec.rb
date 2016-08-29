require "rails_helper"

Capybara.current_driver = :selenium

feature "user authentication" do
  before(:each) do
    visit("/")
  end
  feature "when first visit app" do
    scenario "start logged out" do
      expect(page).to have_content "Log in"
      expect(page).to have_css "#nav-log-in"

      expect(page).to have_content "Sign up"
      expect(page).to have_css "#nav-sign-up"
    end
  end
end
