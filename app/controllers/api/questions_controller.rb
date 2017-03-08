class Api::QuestionsController < ApplicationController
  def index
    @questions = Question.index_all
    question_user_ids = Set.new(Question.pluck("DISTINCT user_id"))
    answer_user_ids = Set.new(Answer.pluck("DISTINCT user_id"))
    user_ids = (question_user_ids + answer_user_ids).to_a
    @users = User.find_with_reputation_hash(user_ids)
  end

  def show
    @question = Question.show_find(params[:id])

    if @question
      View.create!(user: current_user, viewable: @question) if current_user

      @users = User.find_with_reputation_hash(parse_question_user_ids(@question))
    end
  end

  def create
    @question = Question.new(question_params)
    @question.user = current_user
    @question.tags = Tag.where(name: question_params[:tag_names])
    if @question.save!
      # implicit render
    else
      render json: @question.errors.full_messages, status: :unprocessable_entity
    end
  end

  def update
    @question = Question.find(params[:id])

    new_tags = Tag.where(name: question_params[:tag_names])
    if @question.tags != new_tags
      @question.tags = Tag.where(name: question_params[:tag_names])
      @question.updated_at = Time.now
    end

    if @question.user == current_user
      if @question.update!(question_params)
        @users = User.find_with_reputation_hash(parse_question_user_ids(@question))
      else
        render json: @question.errors.full_messages, status: :unprocessable_entity
      end
    else
      render json: {}, status: :forbidden
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
    params.require(:question).permit(:content, :title, tag_names: [])
  end
end
