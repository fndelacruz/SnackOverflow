class ViewsController < ApplicationController
  def create
    @view = View.new(view_params)
    @view.user = current_user
    if @view.save!
      render json: {}
    else
      render json: status: :unprocessable_entity
    end
  end

  private

  def view_params
    params.require(:view).permit(:viewable_type, :viewable_id)
  end
end
