const createError = require("http-errors");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    console.log(error);
    if (error) {
      return next(createError(400, error.message));
    }
    return next();
  };
}

module.exports = {
  validateBody,
};
