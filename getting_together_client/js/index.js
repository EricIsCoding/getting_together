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

document.addEventListener('DOMContentLoaded', () => {
    EventAPI.getEvents().then(events => {
        let root = document.getElementById('root')
        events.forEach(event => {
            new Event(event).save()
            console.log(Event.all)
        });
    })
})



EventAPI.base_url = "http://localhost:3000"