class MapsController < ApplicationController
  allow_unauthenticated_access only: :index

  def index
    @pins = Pin.includes(:user, :image_attachment)
  end
end
