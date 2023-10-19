const { sendMail } = require("../mailer/mailer.service");

const sendUserVerificationMail = async (email, verificationToken) => {
  try {
    const mailOptions = {
      to: email,
      subject: "Welcome to our site!",
      text: `Hello! Please verify your account by visiting http://localhost:3000/api/users/verify/${verificationToken}`,
      html: `<h2>Hello!</h2><br/>Please verify your account by clicking <a href="http://localhost:3000/api/users/verify/${verificationToken}">here</a>!`,
    };
    await sendMail(mailOptions);
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = {
  sendUserVerificationMail,
};
