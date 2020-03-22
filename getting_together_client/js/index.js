class EventAPI {
    static getEvents() {
        return fetch(`${EventAPI.base_url}/events`).then(res => {return res.json()} )
    }
}

EventAPI.base_url = "http://localhost:3000"