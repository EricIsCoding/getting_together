# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

event1 = Event.create(title: "Title", description: "New Description", service: "zoom", date: "03/23/2020", time: "12:01PM")
Event.create(title: "Title 1", description: "New Description", service: "zoom", date: "03/23/2020", time: "12:02PM")
Event.create(title: "Title 2", description: "New Description", service: "zoom", date: "03/23/2020", time: "12:03PM")
Event.create(title: "Title 3", description: "New Description", service: "zoom", date: "03/23/2020", time: "12:04PM")
Event.create(title: "Title 4", description: "New Description", service: "zoom", date: "03/23/2020", time: "12:04PM")


Response.create(respondent: "New Person", content: "This is a great idea.", attending: true, event: event1)