const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index");
const { validateBody } = require("../../middlewares");
const { contactSchema } = require("../../schemas/contacts");

const router = express.Router();
const {
  getContacts,
  getContactById,
  addContacts,
  deleteContacts,
  updateContacts,
} = require("../../controllers/contacts.controllers");

router.get("/", tryCatchWrapper(getContacts));

router.get("/:contactId", tryCatchWrapper(getContactById));

router.post("/", validateBody(contactSchema), tryCatchWrapper(addContacts));

router.delete("/:contactId", tryCatchWrapper(deleteContacts));

router.put(
  "/:contactId",
  validateBody(contactSchema),
  tryCatchWrapper(updateContacts)
);

module.exports = router;
