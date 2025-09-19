class HomeController < ApplicationController
  allow_unauthenticated_access only: [ :index, :offline ]

  def index
  end

  def offline
  end
end
