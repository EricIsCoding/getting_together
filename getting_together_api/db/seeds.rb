# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
require 'faker'
require 'securerandom'

Event.destroy_all
Response.destroy_all

events = []

10.times do
    event = Event.create(
        title: Faker::Lorem.word, 
        description: Faker::Lorem.paragraph, 
        service: ['Zoom', "Google Meet", "Discord", "TableTopia", "NetflixTogether"].sample, 
        date: Faker::Date.between(from: Date.today , to: 2.days.from_now), 
        time: Faker::Number.number(digits: 4)
    );
    events << event
end

30.times do
    Response.create(
        respondent: Faker::Name.name, 
        content: Faker::Lorem.paragraph, 
        attending: [true, false].sample, 
        event: events.sample
    )
end

10.times do
    Response.create(
        respondent: Faker::Name.name, 
        content: Faker::Lorem.paragraph, 
        attending: [true, false].sample, 
        event: events.first
    )
end
