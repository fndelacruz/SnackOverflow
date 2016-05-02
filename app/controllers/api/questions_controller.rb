class Api::QuestionsController < ApplicationController
  def index
    # TODO: implement pagination
    @questions = Question.index_all
    question_user_ids = @questions.map(&:user_id)
    answer_user_ids = @questions.map { |question| question.answers }.flatten
      .map { |answer| answer.user_id}
    user_ids = (question_user_ids + answer_user_ids).uniq
    @users = User.find_with_reputation_hash(user_ids)
  end

  def show
    @question = Question.show_find(params[:id])

    if @question
      View.create!(user: current_user, viewable: @question)

      @users = User.find_with_reputation_hash(parse_question_user_ids(@question))
    end
  end

  def create
    @question = Question.new(question_params)
    @question.user = current_user
    if @question.save!
      # TODO: anything here?
    else
      render json: @question.errors.full_messages, status: :unprocessable_entity
    end
  end

  def destroy
    question = Question.find(params[:id])
    if question
      if question.user == current_user
        question.destroy!
        @questions = Question.index_all
      else
        render json: {}, status: :unauthorized
      end
    else
      render json: {}, status: :not_found
    end
  end

  private

  def question_params
    params.require(:question).permit(:content, :title)
  end
end
