const express = require('express')
const app = express()
const fs = require("fs")

app.use(express.json())

const { Client } = require("pg")
const pgClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'contacts',
  password: 'admin',
  port: 5432,
})
pgClient.connect();

class Contact {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }
  format() {
    return this.firstName + " " + this.lastName;
  }
}

app.get('/', function (req, res) {
  const contacts = []
  pgClient.query('SELECT "firstName", "lastName" FROM contacts', (err, queryResults) => {
    console.log(err, queryResults.rows)

    queryResults.rows.forEach((queryResult) => {
      contacts.push(new Contact(queryResult.firstName, queryResult.lastName))
    });
    const formattedContacts = contacts.map(contact => contact.format())
    let index = fs.readFileSync(`public/index.html`);
    // TODO: Use a templating engine
    index = index.toString().replace("%CONTACTS%", formattedContacts.toString())

    res.send(index)
  })
})

app.post('/contacts', (req, res) => {
  //contacts.push(new Contact(req.body.firstName, req.body.lastName));
  res.sendStatus(200)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000! http://localhost:3000/')
})