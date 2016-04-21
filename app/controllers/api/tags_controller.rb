class Api::TagsController < ApplicationController
  def index
    @tags = Tag.includes(:questions).all # TODO: add appropriate includes
  end
end
