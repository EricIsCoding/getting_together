class EventAPI {
    static getEvents() {
        return fetch(`${EventAPI.base_url}/events`).then( res => {return res.json() } )
    }

    static getEventShow(eventId) {
        return fetch(`${EventAPI.base_url}/events/${eventId}`)
        .then(res =>  res.json() )
        .then(json => {
        const { 
            data: {  
                id,
                attributes: {
                title, 
                description, 
                service,
                date,
                time
                }
            },
            included
            } = json
            return {
                id,
                title,
                description,
                service,
                date,
                time,
                responses: included.map(({id, attributes: {respondent, content, attending}}) => {
                    return {
                    id,
                    respondent,
                    content,
                    attending
                    }
                })
            }
            
        })
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

    static getAll() {
        if(Event.all.length === 0) {
            return EventAPI.getEvents().then(events => {
                let root = document.getElementById('root')
                Event.all = events.map(event => {
                    return new Event(event)
                });
                return Event.all
            })
        } else {
            return Promise,resolve(Event.all)
        }
    }

    static findById(id) {
        return Event.all.find(event => event.id == id)
    }

    save() {
        Event.all.push(this)
        return this
    }

    renderCard() {
        return `<article class="center mw5 mw6-ns hidden ba mv4">
        <h1 class="f4 bg-near-black white mv0 pv2 ph3">${this.title}</h1>
        <div class="pa3 bt">
          <p class="f6 f5-ns lh-copy measure mv0">
          Description: ${this.description} </br>
          Service: ${this.service} </br>
          Date: ${this.date} </br>
          Time: ${this.time} </br>
          </p>
        </div>
        <p><a href="/events/${this.id}" class="eventsShow ba1 pa2 bg-moon-gray link" data-eventid="${this.id}">RSVP</a></p>
      </article>
      `
    }

} 

Event.all = []


class EventsPage {
    constructor(events) {
        this.events = events
    }

    renderCards() {
        return this.events.map(event => {
            return event.renderCard()
          }).join('')
    }

    renderPage( ) {
        root.innerHTML = `<h2>Getting Together</h2>
        ${this.renderCards()}`
    }
}


class EventsShowPage {
    constructor(event) {
        this.event = event
    }

    render() {
        console.log(this.event)
    }
}


document.addEventListener('DOMContentLoaded', () => {
    let root = document.getElementById('root')
    Event.getAll().then(events => { 
        root.innerHtml = new EventsPage(events).renderPage() })
})

EventAPI.base_url = "http://localhost:3000"