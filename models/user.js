const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = Schema(
  {
    password: {
      type: String,
      minLength: [6, "password should be at least 6 characters long"],
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "bisiness"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = model("user", userSchema);

module.exports = { User };
