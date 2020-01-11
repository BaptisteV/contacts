const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

const sanitize = require("./sanitize.js")

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

app.get("/", async (req, res) => {
  res.send(fs.readFileSync(`public/index.html`));
});

app.get("/contacts", async (req, res) => {
  let queryResults = [];
  try {
    queryResults = await pgClient.query(
      'SELECT "firstName", "lastName", "price" FROM contacts ORDER BY "price" DESC'
    );
  } catch (err) {
    console.log(err);
  }
  res.json(queryResults.rows);
});

app.post("/contact", async (req, res) => {
  const insertContactSQL =
    'INSERT INTO contacts("firstName", "lastName", "price") VALUES($1, $2, $3)';

  const newContact = sanitize.sanitizeNewContact(req.body);
  try {
    await pgClient.query(insertContactSQL, [
      newContact.firstName,
      newContact.lastName,
      newContact.price
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

app.put("/contact", async (req, res) => {
  const updateContactSQL =
    'UPDATE contacts SET "price" = $1 WHERE "firstName" = $2 AND "lastName" = $3';

  const newContact = sanitize.sanitizeNewContact(req.body);
  try {
    await pgClient.query(updateContactSQL, [
      newContact.price,
      newContact.firstName,
      newContact.lastName
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
