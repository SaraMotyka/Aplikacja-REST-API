const userDao = require("./users.dao");
const User = require("./user.model");
const authService = require("../auth/auth.service");

const signUpHandler = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
  }

  try {
    const newUser = await userDao.createUser({ email, password });
    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        message: "Registration successful",
      },
    });
  } catch (error) {
    console.error(error.message);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userExist = await userDao.getUser(email);
    if (!userExist || !(await userExist.validatePassword(password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const userPayload = {
      id: userExist._id,
      email: userExist.email,
      subscription: userExist.subscription,
    };

    const token = authService.genAccessToken(userPayload);
    await userDao.updateUser(userExist.email, { token });
    return res.status(200).json({
      user: userPayload,
      token,
    });
  } catch (error) {
    console.error(error.message);
  }
};

const logoutHandler = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    return res.status(204).json({ message: "No content, logout success" });
  } catch (error) {
    return next(error);
  }
};

const currentHandler = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    return res.status(200).json({ user: { email, subscription } });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  signUpHandler,
  loginHandler,
  logoutHandler,
  currentHandler,
};
