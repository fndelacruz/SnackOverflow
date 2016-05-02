class Api::CommentsController < ApplicationController
  def create
    comment = Comment.new(comment_params)
    comment.user = current_user
    if comment.save!
      render_question_show(comment.question.id)
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  def destroy
    comment = Comment.find(params[:id])
    if comment
      if current_user == comment.user
        comment.destroy!
        render_question_show(comment.question.id)
      else
        render json: {}, status: :unauthorized
      end
    else
      render json: {}, status: :unprocessable_entity
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:commentable_id, :commentable_type, :content)
  end
end
