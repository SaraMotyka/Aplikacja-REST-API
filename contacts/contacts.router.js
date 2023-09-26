const express = require("express");
const router = express.Router();
const contactValidationMiddleware = require("./contacts.validators");

const contactsController = require("./contacts.controller");
const { listContacts } = require("./contacts.functions");

router.get("/", listContacts);
router.get("/:id", contactsController.getContactByIdHandler);
router.post(
  "/",
  contactValidationMiddleware,
  contactsController.addContactHandler
);
router.delete("/:id", contactsController.removeContactHandler);
router.put(
  "/:id",
  contactValidationMiddleware,
  contactsController.updateContactHandler
);
router.patch("/:id/favorite", contactsController.updateContactStatusHandler);

module.exports = router;
