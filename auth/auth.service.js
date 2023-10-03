const JWT = require("jsonwebtoken");
const { jwtSecret, jwtLifeTime } = require("../config");

const genAccessToken = (user) => {
  return JWT.sign(user, jwtSecret, { expiresIn: jwtLifeTime ?? "1h" });
};

const verifyToken = (token) => {
  try {
    return JWT.verify(token, jwtSecret);
  } catch (error) {
    console.error(error.message);
    if (error instanceof JWT.TokenExpiredError) {
      throw new Error("Token expired.");
    }
    if (error instanceof JWT.JsonWebTokenError) {
      throw new Error("Token is invalid.");
    }
    throw new Error("Unknown token error");
  }
};
module.exports = {
  genAccessToken,
  verifyToken,
};
