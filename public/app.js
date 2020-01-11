const button = document.getElementById("newContact");

button.addEventListener("click", async _ => {
  await saveNewContact();
});

[
  document.getElementById("initialPrice"),
  document.getElementById("firstName"),
  document.getElementById("lastName")
].forEach(element => {
  element.addEventListener("keyup", async e => {
    const enterKey = 13;
    if (e.keyCode === enterKey) {
      await saveNewContact();
    }
  });
});

async function saveNewContact() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const initialPrice = document.getElementById("initialPrice").value;
  try {
    await fetch("/contact", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        price: initialPrice
      })
    });
    document.location.reload(true);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
}

function createDeleteButton(li, contact) {
  const button = document.createElement("button");
  button.appendChild(document.createTextNode("X"));
  button.addEventListener("click", async _ => {
    try {
      await fetch("/contact", {
        method: "delete",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(contact)
      });
      document.location.reload(true);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  });
  li.appendChild(button);
}

function createPriceInput(li, contact) {
  const priceInput = document.createElement("input");
  priceInput.value = contact.price;
  li.appendChild(priceInput);
  const saveNewPriceButton = document.createElement("button");
  saveNewPriceButton.appendChild(document.createTextNode("Enregistrer"));
  saveNewPriceButton.addEventListener("click", async _ => {
    try {
      await fetch("/contact", {
        method: "put",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({firstName: contact.firstName, lastName: contact.lastName, price: priceInput.value})
      });
      document.location.reload(true);
    } catch (err) {
      console.error(`Error: ${err}`);
    }
  });
  li.appendChild(saveNewPriceButton)
}

function populateContactList(contacts) {
  const contactList = document.getElementById("contactList");
  contacts.forEach(contact => {
    const li = document.createElement("li");
    createDeleteButton(li, contact);
    li.appendChild(
      document.createTextNode(
        " " + contact.firstName + " " + contact.lastName + " "
      )
    );
    contactList.appendChild(li);
    createPriceInput(li, contact);
  });
}

async function getContacts() {
  const res = await fetch("/contacts");
  return await res.json();
}

window.onload = async () => {
  const contacts = await getContacts();
  populateContactList(contacts);
};
