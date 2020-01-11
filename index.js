const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const { Client } = require("pg");
const pgClient = new Client({
  user: "postgres",
  host: "localhost",
  database: "contacts",
  password: "admin",
  port: 5432
});
pgClient.connect();

class Contact {
  constructor(firstName, lastName, price) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.price = price;
  }
  format() {
    return this.firstName + " " + this.lastName;
  }
}

app.get("/", async (req, res) => {
  res.send(fs.readFileSync(`public/index.html`));
});

app.get("/contacts", async (req, res) => {
  const contacts = [];
  try {
    const queryResults = await pgClient.query(
      'SELECT "firstName", "lastName", "price" FROM contacts'
    );
    queryResults.rows.forEach(queryResult => {
      contacts.push(
        new Contact(
          queryResult.firstName,
          queryResult.lastName,
          queryResult.price
        )
      );
    });
  } catch (err) {
    console.log(err);
  }
  res.json(contacts);
});

app.post("/contact", async (req, res) => {
  const insertContactSQL =
    'INSERT INTO contacts("firstName", "lastName", "price") VALUES($1, $2, $3)';

  function sanitizeNewContact (body) {
    let price = req.body.price;
    if (isNaN(price)) price = 0;

    let firstName = body.firstName;
    if(firstName.length === 0) firstName = null;
    
    let lastName = body.lastName;
    if(lastName.length === 0) lastName = null;
    
    return {firstName: firstName, lastName: lastName, price: price}
  } 

  const newContact = sanitizeNewContact(req.body);
  try {
    await pgClient.query(insertContactSQL, [
      newContact.firstName,
      newContact.lastName,
      newContact.price,
    ]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
  res.sendStatus(200);
});

app.delete("/contact", async (req, res) => {
  const deleteContactSQL =
    'DELETE FROM contacts WHERE "firstName" = $1 AND "lastName" = $2';
  try {
    await pgClient.query(deleteContactSQL, [
      req.body.firstName,
      req.body.lastName
    ]);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
    return;
  }
  res.sendStatus(200);
});

app.listen(3000, function() {
  console.log("Example app listening on port 3000! http://localhost:3000/");
});
module.exports = app;
