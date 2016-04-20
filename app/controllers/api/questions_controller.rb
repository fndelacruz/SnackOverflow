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

  def create
    @question = Question.new(question_params)
    @question.user = current_user
    if @question.save!
      # TODO: anything here?
    else
      render json: @question.errors.full_messages, error: :unprocessable_entity
    end
  end

  private

  def question_params
    params.require(:question).permit(:content, :title)
  end
end
