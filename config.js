const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  mongoConnectionString: process.env.MONGO_CONNECTION_STRING,
  jwtSecret: process.env.JWT_SECRET,
  jwtLifeTime: process.env.JWT_LIFETIME,
  gmailPassword: process.env.GMAIL_PASSWORD,
  gmailUser: process.env.GMAIL_USER,
};
