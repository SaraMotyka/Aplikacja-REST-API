const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("./contacts.functions");

const listContactsHandler = async (req, res) => {
  try {
    const contacts = await listContacts();
    return res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

const getContactByIdHandler = async (req, res) => {
  try {
    const contact = await getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(contact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

const addContactHandler = async (req, res) => {
  try {
    const newContact = await addContact(req.body);
    if (!newContact) {
      return res.status(400).json({ message: "Missing require fields" });
    }
    return res.status(201).send(newContact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

const removeContactHandler = async (req, res) => {
  try {
    const removedContact = await removeContact(req.params.id);
    if (removedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "Contact deleted" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

const updateContactHandler = async (req, res) => {
  try {
    const modifiedContact = await updateContact(req.params.id, req.body);
    if (!modifiedContact) {
      return res.status(400).json({ message: "Missing fields" });
    }
    return res.status(200).json(modifiedContact);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

const updateContactStatusHandler = async (req, res) => {
  const { favorite } = req.body;
  if (favorite === null) {
    return res.status(400).json({ message: "Missing field favorite" });
  }
  try {
    const result = await updateStatusContact(req.params.id, req.body);

    if (!result) {
      return res.status(404).json({ message: "Not found" });
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

module.exports = {
  listContactsHandler,
  getContactByIdHandler,
  addContactHandler,
  removeContactHandler,
  updateContactHandler,
  updateContactStatusHandler,
};
