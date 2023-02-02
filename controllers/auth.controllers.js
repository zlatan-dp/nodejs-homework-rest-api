const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");

const { User } = require("../models/user");
const Jimp = require("jimp");
const { SECRET_KEY } = process.env;
const { sendMail } = require("../helpers");

async function register(req, res, next) {
  const { password, email, subscription } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const avatarURL = gravatar.url(email);

  try {
    const verifyId = nanoid();

    await User.create({
      password: hashedPassword,
      email,
      subscription,
      avatarURL,
      verificationToken: verifyId,
    });

    await sendMail({
      to: email,
      subject: "please confirm your email",
      html: `<h1>Confirm your email</h1> <a href="http://localhost:3000/api/users/verify/${verifyId}">confirm</a>`,
    });

    res.status(201).json({
      message: "Created user",
      user: { email, subscription, avatarURL },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error collection")) {
      return next(createError(409, `User with email '${email}' already exist`));
    }
    throw error;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const storedUser = await User.findOne({ email });

  if (!storedUser || !storedUser.comparePassword(password)) {
    return next(createError(401, "Email or password is wrong"));
  }

  if (!storedUser.verify) {
    return next(createError(401, "Email is not verified"));
  }

  const payload = {
    id: storedUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(storedUser._id, { token });
  return res.json({
    data: {
      token,
    },
  });
}

async function logout(req, res, next) {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
}

async function getCurrent(req, res, next) {
  const { email, subscription } = req.user;
  return res.json({
    data: {
      email,
      subscription,
    },
  });
}

async function updateAvatar(req, res, next) {
  const { path: tempUpload, originalname } = req.file;
  const { _id: id } = req.user;
  const avatarName = `${id}_${originalname}`;
  try {
    const resultUpload = path.join(__dirname, "../public/avatars", avatarName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("public", "avatars", avatarName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL });
    Jimp.read(resultUpload, (error, image) => {
      if (error) throw error;
      image.resize(250, 250).write(resultUpload);
    });

    res.json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
    throw error;
  }
}

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    return next(createError(404, "Not found"));
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: "",
  });

  return res.json({
    message: "Verification successful",
  });
}

async function reVerifyEmail(req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return next(createError(404, "Not found"));
  }
  if (user.verify) {
    return next(createError(400, "Verification has already been passed"));
  }

  await sendMail({
    to: email,
    subject: "please confirm your email",
    html: `<h1>Confirm your email</h1> <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">confirm</a>`,
  });
  return res.json({
    message: "Verification email sent",
  });
}
module.exports = {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyEmail,
  reVerifyEmail,
};
