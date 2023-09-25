const { Contact } = require("./contacts.model");

const listContacts = async () => {
  try {
    const contacts = await Contact.find();
    console.log("List of contacts:", contacts);
    return contacts;
  } catch (error) {
    console.error(error.message);
    return [];
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
