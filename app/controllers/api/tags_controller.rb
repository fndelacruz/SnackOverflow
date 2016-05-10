class Api::TagsController < ApplicationController
  def index
    @tags = Tag.index_all # TODO: add appropriate includes
  end

  def show
    @tag = Tag.find_by_name(params[:id])
  end

  def create
    @tag = Tag.new(tag_params)
    if @tag.save!
      # implicit render
    else
      render json: @tag.errors.full_messages, status: :unprocessable_entity
    end
  end

  private

  def tag_params
    params.require(:tag).permit(:name, :description)
  end
end
