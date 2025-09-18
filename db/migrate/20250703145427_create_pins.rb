class CreatePins < ActiveRecord::Migration[8.0]
  def change
    create_table :pins do |t|
      t.decimal :latitude
      t.decimal :longitude
      t.text :comment
      t.integer :rating
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
