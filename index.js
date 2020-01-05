const express = require('express')
const app = express()
const fs = require("fs")

app.use(express.json())

class Contact {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
  format() {
    return this.firstName + " " + this.lastName;
  }
}

const contacts = [];

// TODO: retrieve from the database
contacts.push(new Contact("James", "Hetfield"));
contacts.push(new Contact("Kirk", "Hammet"));

app.get('/', function (req, res) {

  let index = fs.readFileSync(`public/index.html`);
  // TODO: Use a templating engine
  formattedContacts = contacts.map(contact => contact.format())
  index = index.toString().replace("%CONTACTS%", formattedContacts.toString())

  res.send(index)
})

app.post('/contacts', (req, res) => {
  console.log("body", req.body)
  contacts.push(new Contact(req.body.firstName, req.body.lastName));
  console.log(contacts)
  res.sendStatus(200)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000! http://localhost:3000/')
})