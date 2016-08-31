require "rails_helper"

# NOTE: ::default_driver required (as opposed to ::current_driver) for more than
# one test to use selenium/javascript properly

Capybara.default_driver = :selenium
DatabaseCleaner.strategy = :truncation

feature "user authentication" do
  after(:all) { DatabaseCleaner.clean }
  before(:each) { visit("/") }

  feature "when first visit app" do
    scenario "user starts logged out and sees navbar links for authentication" do
      # navbar auth links present
      expect(page).to have_content "Log in"
      expect(page).to have_css "#nav-log-in"
      expect(page).to have_content "Sign up"
      expect(page).to have_css "#nav-sign-up"

      # navbar current user display absent
      expect(page).to_not have_css "#current-user-display-container"
    end

    scenario "user does not see authentication modal" do
      expect(page).to_not have_css ".authentication-modal"
      expect(page).to have_css "#nav-sign-up"
    end

  end

  feature "sign up process" do
    before(:each) { find("#nav-sign-up").click }

    scenario "user can expose a sign up form modal" do
      expect(page).to have_css ".authentication-modal"

      # proper input fields present
      within(".authentication-modal") do
        expect(page).to have_css "input#auth-email"
        expect(page).to have_css "input#auth-display-name"
        expect(page).to have_css "input#auth-password"
      end

      # proper submit button
      within(".authentication-modal button") do
        expect(page).to have_content "Sign up"
        expect(page).to_not have_content "Log in"
      end
    end

    feature "after accessing sign up modal" do
      feature "with proper user credentials" do
        scenario "user can sign up for an account and is then logged in" do
          within(".authentication-modal") do
            fill_in "auth-email", with: "test@user.com"
            fill_in "auth-display-name", with: "ZeroCool"
            fill_in "auth-password", with: "hunter2"
            find("button").click
          end

          expect(page).to_not have_content "Log in"
          expect(page).to_not have_css "#nav-log-in"
          expect(page).to_not have_content "Sign up"
          expect(page).to_not have_css "#nav-sign-up"

          # navbar current user display absent
          expect(page).to have_css "#current-user-display-container"
          within "#current-user-display-container" do
            expect(page).to have_content "ZeroCool"
          end
        end
      end

      feature "with invalid user credentials" do
        after(:each) do
          expect(page).to have_content "Log in"
          expect(page).to have_css "#nav-log-in"
          expect(page).to have_css ".auth-form-errors"
          within(".auth-form-errors") do
            expect(page).to have_content "Sign Up failed."
          end
        end

        feature "with blank email" do
          scenario "user can't sign up and sees relevant error msg" do
            within(".authentication-modal") do
              fill_in "auth-email", with: ""
              fill_in "auth-display-name", with: "ZeroCool"
              fill_in "auth-password", with: "hunter2"
              find("button").click
            end

            within(".auth-form-errors") do
              expect(page).to have_content "Email can't be blank."
            end
          end
        end

        feature "with email already registered" do
          scenario "user can't sign up and sees relevant error msg" do
            within(".authentication-modal") do
              fill_in "auth-email", with: "test@user.com"
              fill_in "auth-display-name", with: "ZeroCool"
              fill_in "auth-password", with: "hunter2"
              find("button").click
            end

            within(".auth-form-errors") do
              expect(page).to have_content "Email has already been taken."
            end
          end
        end

        feature "with blank display name" do
          scenario "user can't sign up and sees relevant error msg" do
            within(".authentication-modal") do
              fill_in "auth-email", with: "test@user.com"
              fill_in "auth-display-name", with: ""
              fill_in "auth-password", with: "hunter2"
              find("button").click
            end

            within(".auth-form-errors") do
              expect(page).to have_content "Display name can't be blank."
            end
          end
        end

        feature "with short password (<6 characters)" do
          scenario "user can't sign up and sees relevant error msg" do
            within(".authentication-modal") do
              fill_in "auth-email", with: "test@user.com"
              fill_in "auth-display-name", with: "ZeroCool"
              fill_in "auth-password", with: ""
              find("button").click
            end

            within(".auth-form-errors") do
              expect(page).to have_content "Password is too short (minimum is 6 characters)."
            end
          end
        end
      end

      scenario "user can switch to Log in mode" do
        within("#auth-submit") { expect(page).to have_content("Sign up") }
        within(".authentication-modal") { find("li", text: "Log In").click }
        within("#auth-submit") { expect(page).to have_content("Log in") }
        within(".authentication-modal") do
          expect(page).to have_css "input#auth-email"
          expect(page).to_not have_css "input#auth-display-name"
          expect(page).to have_css "input#auth-password"
        end
      end
    end
  end

  feature "log in process" do
    before(:each) { find("#nav-log-in").click }

    scenario "user can expose a log in form modal" do
      expect(page).to have_css ".authentication-modal"

      # proper input fields present
      within(".authentication-modal") do
        expect(page).to have_css "input#auth-email"
        expect(page).to_not have_css "input#auth-display-name"
        expect(page).to have_css "input#auth-password"
      end

      # proper submit button
      within(".authentication-modal button") do
        expect(page).to have_content "Log in"
        expect(page).to_not have_content "Sign up"
      end
    end

    feature "after accessing log in modal" do
      feature "with proper user credentials" do
        scenario "user can sign up for an account and is then logged in" do
          # NOTE: before completing the following block, prints "unknown OID 705:
          # failed to recognize type of 'category'. It will be treated as
          # String." but test functionality is preserved. Check this out later.

          within(".authentication-modal") do
            fill_in "auth-email", with: "test@user.com"
            fill_in "auth-password", with: "hunter2"
            find("button").click
          end

          expect(page).to_not have_content "Log in"
          expect(page).to_not have_css "#nav-log-in"

          expect(page).to have_css "#current-user-display-container"
          within "#current-user-display-container" do
            expect(page).to have_content "ZeroCool"
          end
        end
      end

      feature "with nonexistant user credentials" do
        scenario "user can't log in and sees relevant error msg" do
          within(".authentication-modal") do
            fill_in "auth-email", with: "nobody@here.com"
            fill_in "auth-password", with: "password123"
            find("button").click
          end

          expect(page).to have_content "Log in"
          expect(page).to have_css "#nav-log-in"
          expect(page).to have_css ".auth-form-errors"

          within(".auth-form-errors") do
            expect(page).to have_content "No user found with these credentials. Please try again."
          end
        end
      end

      scenario "user can switch to Sign up mode" do
        within("#auth-submit") { expect(page).to have_content("Log in") }
        within(".authentication-modal") { find("li", text: "Sign Up").click }
        within("#auth-submit") { expect(page).to have_content("Sign up") }
        within(".authentication-modal") do
          expect(page).to have_css "input#auth-email"
          expect(page).to have_css "input#auth-display-name"
          expect(page).to have_css "input#auth-password"
        end
      end
    end
  end

  feature "log out process" do
    scenario "a logged in user can log out" do
      # verify user starts not logged in
      expect(page).to have_content "Log in"
      expect(page).to have_css "#nav-log-in"
      expect(page).to have_content "Sign up"
      expect(page).to have_css "#nav-sign-up"
      expect(page).to_not have_css "#current-user-display-container"

      # log in
      find("#nav-log-in").click
      within(".authentication-modal") do
        fill_in "auth-email", with: "test@user.com"
        fill_in "auth-password", with: "hunter2"
        find("button").click
      end

      # verify user is logged in
      expect(page).to_not have_content "Log in"
      expect(page).to_not have_css "#nav-log-in"
      expect(page).to_not have_content "Sign up"
      expect(page).to_not have_css "#nav-sign-up"
      expect(page).to have_css "#current-user-display-container"
      within "#current-user-display-container" do
        expect(page).to have_content "ZeroCool"
      end

      # click on navbar current user display to access current user's show page
      find("#current-user-display-container").click

      within(".user-show-container") do
        # check for existence of log out button on user show page
        expect(page).to have_css "button"
        within("button") { expect(page).to have_content "Log out" }

        # click log out button
        find("button").click
      end

      # ensure user is now logged out
      expect(page).to have_content "Log in"
      expect(page).to have_css "#nav-log-in"
      expect(page).to have_content "Sign up"
      expect(page).to have_css "#nav-sign-up"
      expect(page).to_not have_css "#current-user-display-container"
    end
  end
end
