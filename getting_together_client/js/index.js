class EventAPI {
    static getEvents() {
        return fetch(`${EventAPI.base_url}/events`).then( res => { debugger; } )
    }
}

class Event {
    constructor({ title, description, service, date, time }) {
        this.title = title, 
        this.description = description,
        this.service = service, 
        this.date = date, 
        this.time = time
    }

    render() {
        EventAPI.getEvents().then(events => {
            events.map(eventAttr => {
                console.log(eventAttr)
            })
        })
    }
}

Event.all = []

class EventsPage {
    constructor(events) {
        this.events = events
    }

    render () {
        return `<p>${this.events}</p>`
    }

}

EventAPI.base_url = "http://localhost:3000"
