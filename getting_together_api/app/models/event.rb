class Event < ApplicationRecord
    has_many :responses, :dependent => :delete_all
end
