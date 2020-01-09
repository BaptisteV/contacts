const button = document.getElementById("newContact");
button.addEventListener("click", async _ => {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  try {
    await fetch("/contacts", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ firstName: firstName, lastName: lastName })
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

function populateContactList(contacts) {
  const contactList = document.getElementById("contactList");
  contacts.forEach(contact => {
    const li = document.createElement("li");
    li.appendChild(
      document.createTextNode(contact.firstName + " " + contact.lastName + " ")
    );
    createDeleteButton(li, contact);
    contactList.appendChild(li);
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
