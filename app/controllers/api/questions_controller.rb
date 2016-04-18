class Api::QuestionsController < ApplicationController
  def index
    # TODO: implement pagination
    @questions = Question.detailed_all
  end

  def show
    question = Question.find(params[:id])

    if question
      View.create!(user: current_user, viewable: question)
      @question = Question.detailed_find(params[:id])
    end
  end
end
