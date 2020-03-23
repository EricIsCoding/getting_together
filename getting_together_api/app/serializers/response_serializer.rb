class ResponseSerializer
  include FastJsonapi::ObjectSerializer
  attributes :respondent, :content, :attending, :event_id
  belongs_to :event
end
