const contactsOperations = require("../models/contacts");
const { httpError } = require("../helpers/index");

async function getContacts(req, res, next) {
  const contacts = await contactsOperations.listContacts();
  res.json(contacts);
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;
  const contact = await contactsOperations.getContactById(contactId);

  if (!contact) {
    return next(httpError(404, "Contact Not Found"));
  }
  return res.json({ message: "Contact found", data: contact });
}

async function addContacts(req, res, next) {
  const newContact = await contactsOperations.addContact(req.body);
  res.status(201).json({ message: "Contact added", data: newContact });
}

async function deleteContacts(req, res, next) {
  const { contactId } = req.params;
  const contact = await contactsOperations.getContactById(contactId);

  if (!contact) {
    return next(httpError(404, "Contact Not Found"));
  }
  await contactsOperations.removeContact(contactId);

  res.status(200).json({ message: "Contact deleted", data: contact });
}

async function updateContacts(req, res, next) {
  const { contactId } = req.params;
  const contact = await contactsOperations.getContactById(contactId);
  if (!contact) {
    return next(httpError(404, "Contact Not Found"));
  }
  const updatedContact = await contactsOperations.updateContact(
    contactId,
    req.body
  );
  res.status(200).json({ message: "Contact updated", data: updatedContact });
}

module.exports = {
  getContacts,
  getContactById,
  addContacts,
  deleteContacts,
  updateContacts,
};
