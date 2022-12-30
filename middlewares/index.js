const { httpError } = require("../helpers/index");

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    console.log(error);
    if (error) {
      return next(httpError(400, error.message));
    }
    return next();
  };
}

module.exports = {
  validateBody,
};
