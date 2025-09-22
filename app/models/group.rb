class Group < ApplicationRecord
  has_many :memberships, dependent: :destroy
  has_many :users, through: :memberships
  has_many :pins, dependent: :destroy
  has_many :invitations, class_name: "GroupInvitation", dependent: :destroy

  validates :name, presence: true, length: { maximum: 100 }
end
