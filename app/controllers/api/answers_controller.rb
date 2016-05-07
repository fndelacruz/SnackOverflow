class Api::AnswersController < ApplicationController
  def create
    answer = Answer.new(answer_params)
    answer.user = current_user
    if answer.save!
      render_question_show(answer.question.id)
    else
      render json: answer.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    answer = Answer.find(params[:id])
    if answer
      if answer.user == current_user
        answer.destroy!
        render_question_show(answer.question.id)
      else
        render json: {}, status: :unauthorized
      end
    else
      render json: {}, status: :not_found
    end
  end

  def update
    answer = Answer.find(params[:id])
    if answer.user == current_user
      if answer.update!(answer_params)
        render_question_show(answer.question_id)
      else
        render json: answer.errors.full_messages, status: :unprocessable_entity
      end
    else
      render json: {}, status: :forbidden
    end
  end

  private

  def answer_params
    params.require(:answer).permit(:question_id, :content)
  end
end
