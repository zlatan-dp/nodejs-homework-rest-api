const { Contact } = require("../models/contact.js");

const createError = require("http-errors");

async function getContacts(req, res, next) {
  const contacts = await Contact.find({});
  res.json({
    message: "contacts found",
    data: contacts,
  });
}

async function getContactById(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(createError(404, "Contact Not Found"));
  }
  return res.json({ message: "Contact found", data: contact });
}

async function addContacts(req, res, next) {
  const newContact = await Contact.create(req.body);
  res.status(201).json({ message: "Contact added", data: newContact });
}

async function deleteContacts(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);

  if (!contact) {
    return next(createError(404, "Contact Not Found"));
  }
  await Contact.findByIdAndRemove(contactId);

  res.status(200).json({ message: "Contact deleted", data: contact });
}

async function updateContacts(req, res, next) {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return next(createError(404, "Contact Not Found"));
  }
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  res.status(200).json({ message: "Contact updated", data: updatedContact });
}

async function updateFavorite(req, res, next) {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const contact = await Contact.findById(contactId);
  if (!contact) {
    return next(createError(404, "Contact Not Found"));
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite },
    {
      new: true,
    }
  );
  res.status(200).json({ message: "Contact updated", data: updatedContact });
}

module.exports = {
  getContacts,
  getContactById,
  addContacts,
  deleteContacts,
  updateContacts,
  updateFavorite,
};
