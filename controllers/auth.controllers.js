const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/user");
const { SECRET_KEY } = process.env;

async function register(req, res, next) {
  const { password, email, subscription } = req.body;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    await User.create({
      password: hashedPassword,
      email,
      subscription,
    });
    res
      .status(201)
      .json({ message: "Created user", user: { email, subscription } });
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

  return res.json({
    data: {
      token,
    },
  });
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

module.exports = {
  register,
  login,
  getCurrent,
};
