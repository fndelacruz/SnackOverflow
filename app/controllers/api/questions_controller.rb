class Api::QuestionsController < ApplicationController
  def index
    # TODO: implement pagination
    @questions = Question.includes(:user, :votes, :answers, :views, :tags).all
  end
end
