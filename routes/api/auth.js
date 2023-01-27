const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index");
const { validateBody, auth, upload } = require("../../middlewares");
const { joiRegSchema, joiLogSchema } = require("../../schemas/users");
const {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
} = require("../../controllers/auth.controllers");

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(joiRegSchema),
  tryCatchWrapper(register)
);

authRouter.post("/login", validateBody(joiLogSchema), tryCatchWrapper(login));

authRouter.get("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));

authRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(getCurrent));

authRouter.patch(
  "/avatars",
  tryCatchWrapper(auth),
  upload.single("avatar"),
  tryCatchWrapper(updateAvatar)
);

module.exports = {
  authRouter,
};
