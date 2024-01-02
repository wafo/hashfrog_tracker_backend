const yup = require("yup");

class ValidateError extends Error {
  constructor(message, prop) {
    super(message);
    (this.prop = prop), (this.message = message);
    this.stack = new Error().stack;
  }
}

async function validateType(object = {}, label, schema, options) {
  try {
    if (!schema) return {};
    const value = await yup.object().shape(schema).validate(object);
    return value;
  } catch (error) {
    throw new ValidateError(error.message, label);
  }
}

module.exports = function validate(validateObject, options = {}) {
  return async function onReturn(ctx, next) {
    try {
      if (ctx.headers && validateObject.headers) {
        ctx.headers = await validateType(ctx.headers, "Headers", validateObject.headers);
      }
      if (ctx.params && validateObject.params) {
        ctx.params = await validateType(ctx.params, "Url Params", validateObject.params);
      }
      if (ctx.query && validateObject.query) {
        ctx.query = await validateType(ctx.query, "Query Params", validateObject.query);
      }
      if (ctx.request.body && validateObject.body) {
        ctx.request.body = await validateType(ctx.request.body, "Request Body", validateObject.body);
      }
      return next();
    } catch (error) {
      return ctx.badRequest({
        type: "Validation/ValidationError",
        in: error.prop,
        message: error.message,
      });
    }
  };
};
