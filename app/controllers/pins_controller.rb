class PinsController < ApplicationController
  before_action :set_pin, only: [ :show, :edit, :update, :destroy ]

  def index
    @pins = Pin.recent.includes(:user, :image_attachment)
  end

  def show
  end

  def new
    @pin = current_user.pins.build
  end

  def create
    @pin = current_user.pins.build(pin_params)

    if @pin.save
      redirect_to @pin, notice: "Pin was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @pin.update(pin_params)
      redirect_to @pin, notice: "Pin was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @pin.destroy
    redirect_to pins_url, notice: "Pin was successfully deleted."
  end

  private

  def set_pin
    @pin = Pin.find(params[:id])
  end

  def pin_params
    params.require(:pin).permit(:latitude, :longitude, :comment, :rating, :image)
  end
end
