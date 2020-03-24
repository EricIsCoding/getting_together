class ResponsesController < ApplicationController

    # POST /events
    def create
        @response = Response.new(response_params)
        
        if @response.save
            render json: @response, status: :created, location: @response
        else
            render json: @response.errors, status: :unprocessable_entity
        end
    end

    private 
    
    def response_params
        params.require(:response).permit(:respondent, :content, :attending, :event_id)
    end
end
