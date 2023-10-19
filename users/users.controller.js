const userDao = require("./users.dao");
const User = require("./user.model");
const authService = require("../auth/auth.service");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("jimp");
const mimetypes = require("mime-types");
const { sendUserVerificationMail } = require("./user.mailer");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const signUpHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email in use" });
    }
    const avatarURL = gravatar.url(email, { default: "identicon" }, true);
    const newUser = await userDao.createUser({ email, password, avatarURL });
    await sendUserVerificationMail(newUser.email, newUser.verificationToken);
    return res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        message: "Registration successful",
        avatar: newUser.avatarURL,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const userExist = await userDao.getUser({ email: req.body.email });
    isUserPasswordValid = await userExist.validatePassword(req.body.password);
    if (!userExist || !isUserPasswordValid) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }
    if (!userExist.verify) {
      return res.status(401).json({ message: "User is not verified" });
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
    return next(error);
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

const updateAvatarHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Missing avatar" });
    }
    const { _id } = req.user;
    const { path: tempUpload } = req.file;
    const avatarFileName = `${_id}_${Date.now()}.${mimetypes.extension(
      req.file.mimetype
    )}`;

    const resultUpload = path.join(avatarsDir, avatarFileName);
    const avatarImage = await jimp.read(req.file.path);
    await avatarImage.resize(250, 250).writeAsync(req.file.path);
    await fs.rename(tempUpload, path.join(resultUpload));
    const avatarURL = `http://localhost:3000/avatars/${avatarFileName}`;
    await User.findByIdAndUpdate(_id, { avatarURL });
    return res.status(200).json({ avatarURL });
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Not authorized",
      error: "Wystąpił błąd podczas aktualizacji awatara",
    });
  }
};

const verifyHandler = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await userDao.getUser({ verificationToken });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }
    if (user.verify) {
      return res.status(400).json({ message: "User is already verified. " });
    }
    await userDao.updateUser(user.email, {
      verify: true,
      verificationToken: null,
    });
    return res.status(200).json({ message: "Verification successful" });
  } catch (error) {
    return next(error);
  }
};

const resendVerificationHandler = async (req, res, next) => {
  try {
    const user = await userDao.getUser({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }
    if (user.verify) {
      return res.status(400).json({ message: "User is already verified." });
    }
    await sendUserVerificationMail(user.email, user.verificationToken);
    return res
      .status(200)
      .json({ message: "Email with verification link has already been sent!" });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  signUpHandler,
  loginHandler,
  logoutHandler,
  currentHandler,
  updateAvatarHandler,
  verifyHandler,
  resendVerificationHandler,
};
