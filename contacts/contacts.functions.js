const { Contact } = require("./contacts.model");

const listContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    return res.status(200).json(contacts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Wystąpił błąd serwera." });
  }
};

const getContactById = async (id) => {
  try {
    const contact = await Contact.findById(id);
    return contact;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const removeContact = async (id) => {
  try {
    await Contact.findByIdAndDelete(id);
  } catch (error) {
    console.error(error.message);
  }
};

const addContact = async (body) => {
  try {
    const newContact = new Contact(body);
    const saveContact = await newContact.save();
    return saveContact;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const updateContact = async (id, body) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(id, body, {
      new: true,
    });
    return updatedContact;
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
