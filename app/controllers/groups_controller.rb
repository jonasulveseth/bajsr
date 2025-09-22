class GroupsController < ApplicationController
  before_action :set_group, only: [ :show, :edit, :update, :destroy, :invite ]

  def index
    @groups = current_user.groups
  end

  def show
    redirect_to new_pin_path(group_id: @group.id)
  end

  def new
    @group = Group.new
  end

  def create
    @group = Group.new(group_params)

    if @group.save
      # Add current user as first member
      @group.memberships.create(user: current_user)
      redirect_to new_pin_path(group_id: @group.id), notice: "Group was successfully created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @group.update(group_params)
      redirect_to invite_group_path(@group), notice: "Group was successfully updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @group.destroy
    redirect_to groups_url, notice: "Group was successfully deleted."
  end

  def invite
    if request.get?
      @invitation = @group.invitations.new
      return
    end

    @invitation = @group.invitations.new(invitation_params.merge(invited_by: current_user))
    email = @invitation.email.to_s.downcase.strip
    @invitation.email = email

    if (existing_user = User.find_by(email_address: email)) && @group.users.exists?(existing_user.id)
      redirect_to invite_group_path(@group), alert: "Användaren är redan medlem." and return
    end

    if @group.invitations.pending.exists?(email: email)
      redirect_to invite_group_path(@group), alert: "En inbjudan har redan skickats till den adressen." and return
    end

    if @invitation.save
      GroupInvitationMailer.with(invitation: @invitation).invite_email.deliver_later
      redirect_to invite_group_path(@group), notice: "Inbjudan skickad till #{email}."
    else
      render :invite, status: :unprocessable_entity
    end
  end

  private

  def set_group
    @group = current_user.groups.find(params[:id])
  end

  def invitation_params
    params.require(:group_invitation).permit(:email)
  end

  def group_params
    params.require(:group).permit(:name)
  end
end
