class ResponseSerializer
  include FastJsonapi::ObjectSerializer
  attributes :respondent, :content, :attending
  belongs_to :event
end
