class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  helper_method :current_user

  def login!(user)
    session[:user_id] = user.id
    user.updated_at = DateTime.now
  end

  def logout!
    session[:user_id] = nil
  end

  def current_user
    return nil unless session[:user_id]
    @current_user ||= User.find(session[:user_id])
  end

  def require_login
    redirect_to '/session/new' unless current_user
  end

  def parse_question_user_ids(question)
    ([question.user_id] + question.answers.map(&:user_id)).uniq
  end

  def render_question_show(question_id)
    @question = Question.show_find(question_id)
    @users = User.find_with_reputation_hash(parse_question_user_ids(@question))
    render '/api/questions/show'
  end

  def render_current_user
    @current_user = User.find_with_reputation(current_user.id)
    answers = Answer.notifications_for_user_id(current_user.id)
    comments = Comment.notifications_for_user_id(current_user.id)
    @notifications = (answers + comments).sort_by(&:created_at).reverse
    render 'api/users/current'
  end
end
