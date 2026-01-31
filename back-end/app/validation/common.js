import Joi from "joi";

export const objectId = () => Joi.string().regex(/^[0-9a-fA-F]{24}$/).message("must be a valid ObjectId");
export const email = () => Joi.string().email();
export const phone = () => Joi.string().pattern(/^\d{10}$/).message("must be a 10 digit phone number");
export const lat = () => Joi.number().min(-90).max(90);
export const lng = () => Joi.number().min(-180).max(180);
export const isoDateTime = () => Joi.string().isoDate();
export const vehicleNo = () => Joi.string().pattern(/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/).message("invalid vehicle number");
