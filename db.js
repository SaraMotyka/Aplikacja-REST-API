const mongoose = require("mongoose");
const { mongoConnectionString } = require("./config");

const connect = async () => {
  try {
    await mongoose.connect(mongoConnectionString);
  } catch (error) {
    console.error(error);
    throw new Error("Database connection failed", error.message);
  }
};

const disconnect = async () => {
  try {
    await mongoose.disconnect();
  } catch (error) {
    console.error(error);
    throw new Error("Database disconnection failed", error.message);
  }
};

module.exports = {
  connect,
  disconnect,
};
