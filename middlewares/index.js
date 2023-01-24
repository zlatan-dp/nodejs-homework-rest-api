const createError = require("http-errors");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const path = require("path");

const { User } = require("../models/user");
const { SECRET_KEY } = process.env;

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    // console.log(error);
    if (error) {
      return next(createError(400, error.message));
    }
    return next();
  };
}

async function auth(req, res, next) {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    throw createError(401, "Not authorized");
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw createError(401, "Not authorized");
    }
    req.user = user;
    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw createError(401, "jwt token is not valid");
    }
    throw error;
  }
}

const tempDir = path.join(__dirname, "../temp");

const multerConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = {
  validateBody,
  auth,
  upload,
};
