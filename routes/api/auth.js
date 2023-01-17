const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index");
const { validateBody } = require("../../middlewares");
const { joiRegSchema, joiLogSchema } = require("../../models/user");
const { register, login } = require("../../controllers/auth.controllers");

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(joiRegSchema),
  tryCatchWrapper(register)
);

authRouter.post("/login", validateBody(joiLogSchema), tryCatchWrapper(login));

module.exports = {
  authRouter,
};
