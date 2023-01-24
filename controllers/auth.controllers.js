const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const { User } = require("../models/user");
const Jimp = require("jimp");
const { SECRET_KEY } = process.env;

async function register(req, res, next) {
  const { password, email, subscription } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const avatarURL = gravatar.url(email);

  try {
    await User.create({
      password: hashedPassword,
      email,
      subscription,
      avatarURL,
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

// async function resizeAvatar(path) {
//   const avatar = await Jimp.read(path);
//   await avatar.resize(250, 250);
//   await avatar.writeAsync("new");
// }

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

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
};
