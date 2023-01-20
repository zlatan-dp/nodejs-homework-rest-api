const { Contact } = require("../models/contact.js");

const createError = require("http-errors");

async function getContacts(req, res, next) {
  const { _id } = req.user;
  const { page = 1, limit = 10, favorite = [true, false] } = req.query;
  const skip = (page - 1) * limit;
  const contacts = await Contact.find({ owner: _id, favorite }, "", {
    skip,
    limit: Number(limit),
  }).populate("owner", "_id email subscription");
  res.json({
    message: "contacts found",
    data: contacts,
  });
}

async function getContactById(req, res, next) {
  const { _id } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.findOne({ owner: _id, _id: contactId });

  if (!contact) {
    return next(createError(404, "Contact Not Found"));
  }
  return res.json({ message: "Contact found", data: contact });
}

async function addContacts(req, res, next) {
  const { _id } = req.user;
  const newContact = await Contact.create({ ...req.body, owner: _id });
  res.status(201).json({ message: "Contact added", data: newContact });
}

async function deleteContacts(req, res, next) {
  const { _id } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.findOne({ owner: _id, _id: contactId });

  if (!contact) {
    return next(createError(404, "Contact Not Found"));
  }
  await Contact.findByIdAndRemove(contactId);

  res.status(200).json({ message: "Contact deleted", data: contact });
}

async function updateContacts(req, res, next) {
  const { _id } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.findOne({ owner: _id, _id: contactId });

  if (!contact) {
    return next(createError(404, "Contact Not Found"));
  }
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  res.status(200).json({ message: "Contact updated", data: updatedContact });
}

async function updateFavorite(req, res, next) {
  const { favorite } = req.body;

  const { _id } = req.user;
  const { contactId } = req.params;
  const contact = await Contact.findOne({ owner: _id, _id: contactId });

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
