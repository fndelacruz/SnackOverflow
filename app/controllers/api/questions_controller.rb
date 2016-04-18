class Api::QuestionsController < ApplicationController
  def index
    # TODO: implement pagination
    @questions = Question.includes(:user, :votes, :answers, :views, :tags).all
  end

  def show
    question = Question.find(params[:id])

    if question
      View.create!(user: current_user, viewable: question)
      @question = Question
        .includes(:user, :votes, {answers: [:user, :votes]}, :views, :tags,
          {comments: [:user, :votes]}, :favorites)
        .find(params[:id])
    end
  end
end
