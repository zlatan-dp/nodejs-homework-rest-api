const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const path = require("path");
const contactPath = path.resolve(__dirname, "contacts.json");

async function readContacts() {
  const contacsRaw = await fs.readFile(contactPath);
  const contacts = JSON.parse(contacsRaw);
  return contacts;
}

async function writeContacts(contactsBase) {
  await fs.writeFile(contactPath, JSON.stringify(contactsBase, null, 2));
}

const listContacts = async () => {
  const contacts = await readContacts();
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  const contactById = contacts.find((contact) => contact.id == contactId);
  return contactById || null;
};
const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  await writeContacts(updatedContacts);
};

const addContact = async (body) => {
  const newContact = {
    id: nanoid(),
    ...body,
  };
  const contacts = await readContacts();
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  contacts[index] = { id: contactId, ...body };
  await writeContacts(contacts);
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
