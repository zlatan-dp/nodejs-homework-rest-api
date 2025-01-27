const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "ua"] } })
    .required(),
  phone: Joi.string().min(9).required(),
  favorite: Joi.bool(),
});

const favoriteSchema = Joi.object({
  favorite: Joi.bool().required(),
});

module.exports = {
  contactSchema,
  favoriteSchema,
};
