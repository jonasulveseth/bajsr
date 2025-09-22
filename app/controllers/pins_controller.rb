class PinsController < ApplicationController
  allow_unauthenticated_access only: [:new, :create]
  before_action :set_groups_context, only: %i[new create]
  before_action :set_pin, only: %i[show edit update destroy]

  def index
    redirect_to new_pin_path
  end

  def show
  end

  def new
    @pin = Pin.new(group: @current_group)
  end

  def create
    user = current_user || User.first # Use default user for testing
    @pin = Pin.new(pin_params.merge(group: @current_group, user: user))

    if @pin.save
      redirect_to maps_path, notice: "Pin registrerad framgångsrikt!"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @pin.update(pin_params)
      redirect_to new_pin_path(group_id: @pin.group_id), notice: "Pin was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    group_id = @pin.group_id
    @pin.destroy
    redirect_to new_pin_path(group_id: group_id), notice: "Pin was successfully deleted."
  end

  private

  def set_groups_context
    if current_user
      @groups = current_user.groups
      if @groups.empty?
        redirect_to groups_path, alert: "Skapa eller gå med i en grupp först." and return
      end
      requested_group_id = params[:group_id].presence || session[:current_group_id]
      @current_group = @groups.find_by(id: requested_group_id) if requested_group_id.present?
      @current_group ||= @groups.first
      session[:current_group_id] = @current_group.id
    else
      # For unauthenticated access, use the default group
      @current_group = Group.first
      @groups = [@current_group] if @current_group
    end

    if action_name == "new" && params[:group_id].to_i != @current_group.id
      redirect_to new_pin_path(group_id: @current_group.id) and return
    end

    preload_map_pins
  end

  def preload_map_pins
    user = current_user || User.first
    @pins_for_map = @current_group.pins.where(user: user).includes(:user, image_attachment: :blob)
    @pins_payload = @pins_for_map.map do |pin|
      {
        id: pin.id,
        lat: pin.latitude.to_f,
        lng: pin.longitude.to_f,
        rating: pin.rating,
        comment: pin.comment,
        user: pin.user.email_address,
        created_at: pin.created_at.strftime("%d %b %Y"),
        image_url: pin.image.attached? ? url_for(pin.image) : nil,
        show_url: pin_path(pin)
      }
    end
  end

  def set_pin
    @pin = current_user.pins.find(params[:id])
  end

  def pin_params
    params.require(:pin).permit(:latitude, :longitude, :comment, :rating, :image, :group_id)
  end
end
