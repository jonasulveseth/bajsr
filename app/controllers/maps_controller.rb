class MapsController < ApplicationController
  def index
    @pins = Pin.includes(:user, :image_attachment)
  end
end
