class Pin < ApplicationRecord
  belongs_to :user
  has_one_attached :image

  validates :latitude, presence: true, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }
  validates :longitude, presence: true, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
  validates :rating, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5, only_integer: true }
  validates :comment, presence: true, length: { maximum: 1000 }
  validates :image, content_type: [ "image/png", "image/jpeg", "image/jpg" ], size: { less_than: 5.megabytes }

  scope :recent, -> { order(created_at: :desc) }
  scope :by_rating, ->(rating) { where(rating: rating) }
end
