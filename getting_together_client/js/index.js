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
                responses: included.map(({id, attributes: {respondent, content, attending, event_id}}) => {
                    return {
                    id,
                    respondent,
                    content,
                    attending, 
                    event_id
                    }
                })
            }
            
        })
    }
}

EventAPI.base_url = "http://localhost:3000"

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
            return Promise.resolve(Event.all)
        }
    }

    getEventInfo() {
        if(this.responses().length === 0) {
            return EventAPI.getEventShow(this.id)
                .then((e) => {
                    e.responses.forEach(resp => {
                        Response.findOrCreateBy(resp)
                    });
                    return this
                })
        } else {
                return Promise.resolve(this)
        }
    }
    

    static findById(id) {
        return Event.all.find(event => event.id == id)
    }
    
    responses() {
        return Response.all.filter(resp => resp.eventId == this.id)
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
        <p><a href="#/events/${this.id}" class="eventsShow ba1 pa2 bg-moon-gray link" data-eventId="${this.id}">RSVP</a></p>
      </article>
      `
    }

} 
 
Event.all = []

class Response {
    constructor({id, respondent, content, attending, event_id}) {
        this.id = id,
        this.respondent = respondent,
        this.content = content,
        this.attending = attending,
        this.eventId = event_id
    }

    static findOrCreateBy(attr) {
        let response = Response.all.find(resp => resp.eventId == attr.eventId)
        return response ? response : new Response(attr).save()
    }

    save() {
        Response.all.push(this)
        return this
    }

}


Response.all = []


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
        return `
        <article class="center mw5 mw6-ns hidden ba mv4">
        <h1 class="f4 bg-near-black white mv0 pv2 ph3">${this.event.title}</h1>
        <div class="pa3 bt">
          <p class="f6 f5-ns lh-copy measure mv0">
          Description: ${this.event.description} </br>
          Service: ${this.event.service} </br>
          Date: ${this.event.date} </br>
          Time: ${this.event.time} </br>
          # of Responses: ${this.event.responses().length} </br>
          </p>
          </div>
          `
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let root = document.getElementById('root')
    Event.getAll().then(events => { 
        root.innerHtml = new EventsPage(events).renderPage() })
})
    document.addEventListener('click', (e) => {
    if(e.target.matches('.eventsShow')) {
        alert('This is an event!')
    }
  })