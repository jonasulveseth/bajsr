class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy
  has_many :pins, dependent: :destroy
  has_many :memberships, dependent: :destroy
  has_many :groups, through: :memberships

  normalizes :email_address, with: ->(e) { e.strip.downcase }
end
