class GroupInvitation < ApplicationRecord
  belongs_to :group
  belongs_to :invited_by, class_name: "User"

  before_validation :generate_token, on: :create

  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :token, presence: true, uniqueness: true

  scope :pending, -> { where(accepted_at: nil) }

  def mark_accepted!
    update!(accepted_at: Time.current)
  end

  private
    def generate_token
      self.token ||= SecureRandom.hex(20)
    end
end
