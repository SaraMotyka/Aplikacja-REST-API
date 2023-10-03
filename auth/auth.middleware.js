const authService = require("./auth.service");
const User = require("../users/user.model");
const userDao = require("../users/users.dao");

const getTokenFromHeaders = (headers) => {
  return headers.authorization?.replace("Bearer ", "");
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req.headers);

    if (!token) {
      return res.status(401).json({ message: "Token is missing." });
    }
    const { id } = authService.verifyToken(token);
    const userExist = await User.findById(id);

    if (!userExist || userExist.token !== token) {
      throw new Error("Token is invalid.");
    }

    req.user = userExist;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized" });
  }
};

module.exports = {
  getTokenFromHeaders,
  authMiddleware,
};
