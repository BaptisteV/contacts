const button = document.getElementById('newContact');
button.addEventListener('click', async _ => {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    try {
        await fetch('/contacts', {
            method: 'post',
            headers: {
                "Accept": "application/json",
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "firstName": firstName, "lastName": lastName })
        });
        document.location.reload(true);
    } catch (err) {
        console.error(`Error: ${err}`);
    }
});

function populateContactList(contacts){
    const contactList = document.getElementById("contactList")
    contacts.forEach((contact) => {
        const li = document.createElement("li")
        li.appendChild(document.createTextNode(contact.firstName + " " + contact.lastName))
        contactList.appendChild(li)
    })
}

async function getContacts() {
    const res = await fetch("/contacts")
    return await res.json()
}

window.onload = async () => {
    const contacts = await getContacts()
    populateContactList(contacts)
}