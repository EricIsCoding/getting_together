class EventAPI {
    static getEvents() {
        return fetch(`${EventAPI.base_url}/events`).then( res => res.json()  )
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
    static createEvent(eventAttr) {
        return fetch(`${EventAPI.base_url}/events`, {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(eventAttr)
        }).then( res =>  res.json() )
    }

    static createResponse(responseAttr) {
        return fetch(`${EventAPI.base_url}/responses`, {
            method: "POST", 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(responseAttr)
        }).then( res =>  res.json() )
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

    static create(eventAttr) {
        return EventAPI.createEvent(eventAttr).then(event => {
            return new Event(event).save()
        })
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
        return `
        <article class="center mw5 mw6-ns hidden ba mv4">
        <h1 class="f4 bg-black-90 white mv0 pv2 ph3">${this.title}</h1>
        <div class="pa3 bt">
          <p class="f6 f5-ns lh-copy measure mv0">
          Description: ${this.description} </br>
          Service: ${this.service} </br>
          Date: ${this.date} </br>
          Time: ${this.time} </br>
          </p>
        </div>
        <p><a href="#/events/${this.id}" class="eventsShow ba1 pa2 bg-light-gray link" data-eventId="${this.id}">RSVP</a></p>
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

    static create(respAttr) {
        return EventAPI.createResponse(respAttr).then(response => {
            return new Response(response).save()
        })
    }

    static renderResponseForm(eventId) {
        return `
        <form action="" class="createResponse" >
            <input type="hidden" id="event_id" value="${eventId}">
            <div>
                <label class="f6 b db mb2">Your Name:</label>
                <input type="text" class="input-reset ba b--black-20 pa2 mb2 db w-25" name="respondent" id="respondent">
            </div>  
            <div>
                <label class="f6 b db mb2">Your Message:</label>
                <input type="text" class="input-reset ba b--black-20 pa2 mb2 db w-25" name="content" id="content">
            </div>  
            <div>
                <legend class="fw7 mb2">Attending? Check Box if Yes:</legend>
                <input type="checkbox" class="mr2" name="attending" id="attending">
            </div>  
                <input type="submit" value="Create Response" class="createResponse">
        </form>
        `
    }

    event() {
        return Event.findById(this.eventId)
    }

    save() {
        Response.all.push(this)
        return this
    }

    renderRespCard() {
        let attending = this['attending']
        return `
        <div class="fl w-50 w-25-m w-20-l pa2">
          <article class="db mw5 center bg-light-gray br3 pa3 pa4-ns mv3 ba b--black-10">
            <div class="tc">
                <h1 class="f4">${this.respondent}</h1>
                <hr class="mw3 bb bw1 b--black-10"/>
            </div>
            <h6>Attending?</h6>
            <p>${attending ? 'yes' : 'no'}</p>
            <p class="lh-copy measure center f6 black-70">
            ${this.content}
            </p>
          </article>  
        </div>
        `
    }
}


Response.all = []


class EventsPage {
    constructor(events) {
        this.events = events
    }

    renderEventForm() {
        return ` <form action="" class="createEvent">
    <div>
        <label class="f6 b db mb2">Title:</label>
        <input type="text" class="input-reset ba b--black-20 pa2 mb2 db w-25" name="title" id="title">
    </div>  
    <div>
        <label class="f6 b db mb2">Description:</label>
        <input type="text" class="input-reset ba b--black-20 pa2 mb2 db w-25" name="description" id="description">
    </div>  
    <div>
        <label class="f6 b db mb2">Service:</label>
        <input type="text" class="input-reset ba b--black-20 pa2 mb2 db w-25" name="service" id="service">
    </div>  
    <div>
        <label class="f6 b db mb2">Date:</label>
        <input type="text" class="input-reset ba b--black-20 pa2 mb2 db w-25" name="date" id="date">
    </div>  
    <div>
        <label class="f6 b db mb2">Time:</label>
        <input type="text" class="input-reset ba b--black-20 pa2 mb2 db w-25" name="time" id="time">
    </div>
    <input type="submit" value="Create Event" class="createEvent">
</form>
        `
    }

    renderCards() {
        return this.events.map(event => {
            return event.renderCard()
          }).join('')
    }

    indexNav() {
        let nav = document.querySelector('nav')
        nav.innerHTML = `<a href="#/home" class="home link dim white dib mr3">Home</a>
        <a href="#/create_event" class="addEvent link dim white dib mr3">Add Event</a>`
    }

    renderFormPage() {
        this.indexNav()
        return `
        ${this.renderEventForm()}
        ${this.renderCards()}
        `
    } 

    renderPage() {
        this.indexNav()
        return  `
        ${this.renderCards()}`
    }
}


class EventsShowPage {
    constructor(event) {
        this.event = event
    }

    renderResponseList() {
        let list = this.event.responses().map(resp => {
            return resp.renderRespCard()
        }).join(" ")
        return `
        <article>
            <div class="cf pa2">
                ${list}
            </div>
        </article>
        `
    }

    showNav() {
        let nav = document.querySelector('nav')
        nav.innerHTML =  `<a href="#/home" class="home link dim white dib mr3">Home</a>
        <a href="#/add_response" class="addResponse link dim white dib mr3" data-eventid="${this.event.id}">Add Response</a>
        `
    }

    
    renderEventCard() {
        return `
        <article class="center mw5 mw6-ns hidden ba mv4">
        <h1 class="f4 bg-black-90 white mv0 pv2 ph3">${this.event.title}</h1>
        <div class="pa3 bt">
            <p class="f6 f5-ns lh-copy measure mv0">
                Description: ${this.event.description} </br>
                Service: ${this.event.service} </br>
                Date: ${this.event.date} </br>
                Time: ${this.event.time} </br>
                # of Responses: ${this.event.responses().length} </br>
            </p>
          </div>
          </article>`
    }

    renderAddResponse() {
        this.showNav()
        return `
        ${Response.renderResponseForm(this.event.id)}
        ${this.renderEventCard()}
        ${this.renderResponseList()}
    `
    }

    renderShowPage() {
        this.showNav()
        return `
            ${this.renderEventCard()}
            ${this.renderResponseList()}
        `
    }

}

document.addEventListener('DOMContentLoaded', () => {
    let root = document.getElementById('root')
    Event.getAll().then(events => { 
       root.innerHTML = new EventsPage(events).renderPage()
    })
    document.addEventListener('click', (e) => {
    if(e.target.matches('.eventsShow')) {
        let event = Event.findById(e.target.dataset.eventid)
        event.getEventInfo().then(event => {
            root.innerHTML = new EventsShowPage(event).renderShowPage()
        })
    }
    if(e.target.matches('.home')) {
        root.innerHTML = new EventsPage(Event.all).renderPage()
    }
    if(e.target.matches('.addEvent')) {
        Event.getAll().then(events => { 
            root.innerHTML = new EventsPage(events).renderFormPage()
        })
    }
    if(e.target.matches('.addResponse')) {
        let event = Event.findById(e.target.dataset.eventid)
        event.getEventInfo().then(event => {
            root.innerHTML = new EventsShowPage(event).renderAddResponse()
        })
    }
  })
  document.addEventListener('submit', e => {
    e.preventDefault()
    if(e.target.matches('.createEvent')) {
        let formData = {}
        e.target.querySelectorAll('input[type="text"]').forEach( input => {
            formData[input.id] = input.value
        })
        Event.create(formData).then( event => {
            root.innerHTML = new EventsPage(Event.all).renderPage() 
        })
    }
    if(e.target.matches('.createResponse')) {
        let formData = {}
        e.target.querySelectorAll('input').forEach( input => {

            if (input.value != "Create Response" && input.id != 'attending') {
                formData[input.id] = input.value
            } else if (input.id == 'attending') {
                if (input.checked) {
                    formData['attending'] = true
                } else {
                    formData['attending'] = false
                }
            }
        })
        Response.create(formData).then( response => {
            root.innerHTML = new EventsShowPage(response.event()).renderShowPage()
        })
    }
})
})