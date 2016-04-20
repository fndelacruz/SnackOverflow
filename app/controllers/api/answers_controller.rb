class Api::AnswersController < ApplicationController
  def create
    answer = Answer.new(answer_params)
    answer.user = current_user
    if answer.save!
      @question = Question.detailed_find(answer.question.id)
    else
      render json: answer.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    answer = Answer.find(params[:id])
    if answer
      if answer.user == current_user
        answer.destroy!
        @question = Question.detailed_find(answer.question.id)
      else
        render json: {}, status: :unauthorized
      end
    else
      render json: {}, status: :not_found
    end
  end

  private

  def answer_params
    params.require(:answer).permit(:question_id, :content)
  end
end
