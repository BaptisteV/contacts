const button = document.getElementById("newContact");
button.addEventListener("click", async _ => {
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
      body: JSON.stringify({ firstName: firstName, lastName: lastName, price: initialPrice })
    });
    document.location.reload(true);
  } catch (err) {
    console.error(`Error: ${err}`);
  }
});

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

function createPriceInput(li, contact){
  const priceInput = document.createElement("input");
  priceInput.value = contact.price;
  li.appendChild(priceInput);
}

function populateContactList(contacts) {
  const contactList = document.getElementById("contactList");
  contacts.forEach(contact => {
    const li = document.createElement("li");
    createDeleteButton(li, contact);
    li.appendChild(
      document.createTextNode(" " + contact.firstName + " " + contact.lastName + " ")
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
