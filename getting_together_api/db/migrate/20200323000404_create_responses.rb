class CreateResponses < ActiveRecord::Migration[6.0]
  def change
    create_table :responses do |t|
      t.string :respondent
      t.string :content
      t.boolean :attending
      t.belongs_to :event, null: false, foreign_key: true

      t.timestamps
    end
  end
end
