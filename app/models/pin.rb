class Pin < ApplicationRecord
  belongs_to :user
  has_one_attached :image

  validates :latitude, presence: true, numericality: { greater_than_or_equal_to: -90, less_than_or_equal_to: 90 }
  validates :longitude, presence: true, numericality: { greater_than_or_equal_to: -180, less_than_or_equal_to: 180 }
  validates :rating, presence: true, numericality: { greater_than_or_equal_to: 1, less_than_or_equal_to: 5, only_integer: true }
  validates :comment, presence: true, length: { maximum: 1000 }
  validate :acceptable_image

  scope :recent, -> { order(created_at: :desc) }
  scope :by_rating, ->(rating) { where(rating: rating) }

  private
    def acceptable_image
      return unless image.attached?

      unless image.content_type.in?(%w[image/png image/jpeg image/jpg])
        errors.add(:image, "must be a PNG or JPG")
      end

      if image.byte_size > 5.megabytes
        errors.add(:image, "needs to be smaller than 5 MB")
      end
    end
end
