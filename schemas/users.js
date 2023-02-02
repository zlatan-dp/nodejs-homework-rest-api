const Joi = require("joi");

const joiRegSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  subscription: Joi.string(),
});

const joiLogSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

const joiVerEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});

module.exports = { joiRegSchema, joiLogSchema, joiVerEmailSchema };
