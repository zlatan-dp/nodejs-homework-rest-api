const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index");
const { validateBody, auth } = require("../../middlewares");
const { joiRegSchema, joiLogSchema } = require("../../models/user");
const {
  register,
  login,
  getCurrent,
} = require("../../controllers/auth.controllers");

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(joiRegSchema),
  tryCatchWrapper(register)
);

authRouter.post("/login", validateBody(joiLogSchema), tryCatchWrapper(login));

authRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(getCurrent));

module.exports = {
  authRouter,
};
