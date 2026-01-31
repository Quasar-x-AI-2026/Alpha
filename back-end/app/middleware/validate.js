import Joi from "joi";

export default function validate(schema) {
  return (req, res, next) => {
    const options = { abortEarly: false, stripUnknown: true, convert: true };
    const { error, value } = schema.validate(req.body, options);
    if (error) {
      const details = error.details?.map((d) => d.message.replace(/"/g, '')) || [];
      return res.status(400).json({
        isSuccess: false,
        message: "Validation failed",
        errors: details,
      });
    }
    req.body = value;
    next();
  };
}
