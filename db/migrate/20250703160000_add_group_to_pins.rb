class AddGroupToPins < ActiveRecord::Migration[8.0]
  def change
    add_reference :pins, :group, foreign_key: true
    add_index :pins, [:group_id, :user_id]
  end
end
