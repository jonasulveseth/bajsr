class GroupInvitationMailer < ApplicationMailer
  default from: ENV.fetch("MAILER_FROM", "no-reply@bajsr.app")

  def invite_email
    @invitation = params[:invitation]
    @group = @invitation.group
    @signup_url = new_registration_url(invitation_token: @invitation.token, **url_options)

    mail to: @invitation.email, subject: "#{@group.name}: du är inbjuden"
  end

  private
    def url_options
      host = ENV.fetch("APP_HOST", "localhost")
      protocol = ENV.fetch("APP_PROTOCOL", "https")
      port = ENV["APP_PORT"]

      options = { host:, protocol: }
      options[:port] = port if port.present?
      options
    end
end
