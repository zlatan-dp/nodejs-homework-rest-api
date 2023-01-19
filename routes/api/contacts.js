const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index");
const { auth, validateBody } = require("../../middlewares");
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

router.get("/", tryCatchWrapper(auth), tryCatchWrapper(getContacts));

router.get(
  "/:contactId",
  tryCatchWrapper(auth),
  tryCatchWrapper(getContactById)
);

router.post(
  "/",
  tryCatchWrapper(auth),
  validateBody(contactSchema),
  tryCatchWrapper(addContacts)
);

router.delete(
  "/:contactId",
  tryCatchWrapper(auth),
  tryCatchWrapper(deleteContacts)
);

router.put(
  "/:contactId",
  tryCatchWrapper(auth),
  validateBody(contactSchema),
  tryCatchWrapper(updateContacts)
);

router.patch(
  "/:contactId/favorite",
  tryCatchWrapper(auth),
  validateBody(favoriteSchema),
  tryCatchWrapper(updateFavorite)
);

module.exports = router;
