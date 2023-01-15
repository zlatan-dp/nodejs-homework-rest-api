const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index");
const { validateBody } = require("../../middlewares");
const { contactSchema, favoriteSchema } = require("../../schemas/contacts");

const router = express.Router();
const {
  getContacts,
  getContactById,
  addContacts,
  deleteContacts,
  updateContacts,
  updateFavorite,
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

router.patch(
  "/:contactId/favorite",
  validateBody(favoriteSchema),
  tryCatchWrapper(updateFavorite)
);

module.exports = router;
