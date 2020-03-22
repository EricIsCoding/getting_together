class EventAPI {
    static getEvents() {
        return fetch(`${EventAPI.base_url}/events`).then(res => {return res.json()} )
    }
}

class Event {
    constructor(event) {
        this.id = event.id,
        this.title = event.title, 
        this.description = event.description, 
        this.service = event.service, 
        this.date = event.date, 
        this.time = event.time
    }

} 


EventAPI.base_url = "http://localhost:3000"