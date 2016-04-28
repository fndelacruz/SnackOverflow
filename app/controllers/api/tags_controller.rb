class Api::TagsController < ApplicationController
  def index
    @tags = Tag.index_all # TODO: add appropriate includes
  end

  def show
    @tag = Tag.find_by_name(params[:id])
  end
end
