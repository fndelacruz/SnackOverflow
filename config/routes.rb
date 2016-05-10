Rails.application.routes.draw do
  root to: 'static_pages#root'
  resources :users, only: [:new, :create]
  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
    resources :users, except: [:new, :edit, :destroy] do
      collection do
        get 'current'
      end
    end
    resources :questions, except: [:new, :edit]
    resources :votes, only: [:create, :destroy]
    resources :favorites, only: [:create, :destroy]
    resources :comments, only: [:create, :destroy]
    resources :answers, only: [:create, :destroy, :update]
    resources :tags, only: [:index, :show, :create]
    resources :badges, only: [:index, :show]
  end
end
