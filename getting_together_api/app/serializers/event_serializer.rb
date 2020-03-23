class EventSerializer
  include FastJsonapi::ObjectSerializer
  attributes :title, :description, :service, :date, :time
  has_many :responses
end
