module AuthHelper
  def create_test_user
    create(:user, email: "foo@foo.foo", display_name: "foo", password: "foofoo")
  end

  def login_test_user
    find("#nav-log-in").click
    within(".authentication-modal") do
      fill_in "auth-email", with: "foo@foo.foo"
      fill_in "auth-password", with: "foofoo"
      find("button").click
    end
  end
end
