Rails.application.routes.draw do
  get "invitations/create"
  get "groups/index"
  get "groups/show"
  get "groups/new"
  get "groups/create"
  get "groups/edit"
  get "groups/update"
  get "groups/destroy"
  get "maps/index"
  get "pins/index"
  get "pins/show"
  get "pins/new"
  get "pins/create"
  get "pins/edit"
  get "pins/update"
  get "pins/destroy"
  resource :session
  resource :registration, only: %i[new create]
  resource :dashboard, only: :show
  resources :passwords, param: :token
  resources :pins
  resources :groups do
    post :invite, on: :member
  end
  get "maps", to: "maps#index"
  get "home/index"
  get "offline", to: "home#offline"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  root "home#index"
end
