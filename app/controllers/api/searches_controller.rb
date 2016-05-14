class Api::SearchesController < ApplicationController
  def query
    if params[:q]
      @posts = Question.search(params[:q]) + Answer.search(params[:q])
      @posts.each do |post|
        post.matches = post.content.downcase.scan(params[:q]).count
        post.matches += post.title.downcase.scan(params[:q]).count
      end

      unless @posts.empty?
        @users_hash = User.find_with_reputation_hash(@posts.map(&:user_id).uniq)
      end
    else
      render json: {}, status: :not_found
    end
  end
end
