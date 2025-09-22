class RegistrationsController < ApplicationController
  allow_unauthenticated_access only: %i[new create]

  before_action :load_invitation

  def new
    @user = User.new(email_address: @invitation&.email)
  end

  def create
    @user = User.new(user_params)

    if @user.save
      attach_invited_membership(@user)
      start_new_session_for @user
      redirect_to after_authentication_url, notice: "Välkommen! Ditt konto är redo."
    else
      render :new, status: :unprocessable_entity
    end
  end

  private
    def user_params
      params.require(:user).permit(:email_address, :password, :password_confirmation)
    end

    def load_invitation
      token = params[:invitation_token].presence || params.dig(:user, :invitation_token).presence
      return if token.blank?

      @invitation = GroupInvitation.pending.find_by(token: token)
    end

    def attach_invited_membership(user)
      return unless @invitation

      group = @invitation.group
      group.memberships.find_or_create_by!(user: user)
      @invitation.mark_accepted!
    end
end
