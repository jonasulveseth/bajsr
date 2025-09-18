class GroupsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_group, only: [ :show, :edit, :update, :destroy, :invite ]

  def index
    @groups = current_user.groups
  end

  def show
    @members = @group.users
    @pins = @group.users.joins(:pins).distinct
  end

  def new
    @group = Group.new
  end

  def create
    @group = Group.new(group_params)

    if @group.save
      # Add current user as first member
      @group.memberships.create(user: current_user)
      redirect_to @group, notice: "Group was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @group.update(group_params)
      redirect_to @group, notice: "Group was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @group.destroy
    redirect_to groups_url, notice: "Group was successfully deleted."
  end

  def invite
    email = params[:email]

    if email.blank?
      redirect_to @group, alert: "Email is required."
      return
    end

    user = User.find_by(email_address: email.downcase.strip)

    if user.nil?
      redirect_to @group, alert: "User not found. They need to register first."
      return
    end

    if @group.users.include?(user)
      redirect_to @group, alert: "User is already a member of this group."
      return
    end

    @group.memberships.create(user: user)
    redirect_to @group, notice: "#{user.email_address} was successfully added to the group."
  end

  private

  def set_group
    @group = Group.find(params[:id])
  end

  def group_params
    params.require(:group).permit(:name)
  end
end
