class PwaInstallController < ApplicationController
  allow_unauthenticated_access only: :dismiss

  def dismiss
    session[:hide_pwa_banner] = true
    cookies[:hide_pwa_banner] = {
      value: "1",
      expires: 1.week.from_now,
      httponly: false
    }
    Rails.logger.info("[PWA Install] session hide flag set to #{session[:hide_pwa_banner].inspect}, cookie set")
    render json: { dismissed: true, hide_pwa_banner: session[:hide_pwa_banner] }
  end
end
