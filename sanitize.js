function sanitizeNewContact(body) {
  let price = body.price;
  if (isNaN(parseFloat(price))) {
    console.error("Invalid price: ", price);
    price = 0;
  } else {
    price = parseFloat(price);
  }

  let firstName = body.firstName;
  if (firstName.length === 0) firstName = null;

  let lastName = body.lastName;
  if (lastName.length === 0) lastName = null;

  return { firstName: firstName, lastName: lastName, price: price };
}

module.exports = { sanitizeNewContact };