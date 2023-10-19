const { Contact } = require("./contacts.model");

const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (error) {
    console.error(error.message);
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

const updateStatusContact = async (id, body) => {
  try {
    const { favorite } = body;
    if (!favorite) {
      console.log("Favorite is empty");
    }
    const data = await Contact.findByIdAndUpdate(
      { _id: id },
      { favorite: favorite },
      { new: true }
    );

    if (data === null) {
      return "Contact not found";
    }
    return data;
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
  updateStatusContact,
};
