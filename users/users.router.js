const express = require("express");
const usersRouter = express.Router();
const userValidateMiddleware = require("./users.validators");
const { authMiddleware } = require("../auth/auth.middleware");

const usersController = require("./users.controller");

usersRouter.post(
  "/signup",
  userValidateMiddleware,
  usersController.signUpHandler
);

usersRouter.post(
  "/login",
  userValidateMiddleware,
  usersController.loginHandler
);

usersRouter.get("/secret", authMiddleware, (req, res) =>
  res.status(200).json({ message: "Secret path." })
);

usersRouter.get("/logout", authMiddleware, usersController.logoutHandler);

usersRouter.get("/current", authMiddleware, usersController.currentHandler);

module.exports = usersRouter;
