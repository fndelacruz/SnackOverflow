class Api::TagsController < ApplicationController
  def index
    @tags = Tag.includes(taggings: :question).all # TODO: add appropriate includes
  end
end
