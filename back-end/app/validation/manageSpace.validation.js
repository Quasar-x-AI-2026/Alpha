import Joi from "joi";
import { objectId, email, phone, lat, lng } from "./common.js";

export const login = Joi.object({
  email: email().required(),
  password: Joi.string().min(4).required(),
});

export const addUser = Joi.object({
  edit: Joi.boolean().optional(),
  providerId: objectId().optional(),

  fullName: Joi.string().min(2).required(),
  spaceName: Joi.string().min(2).required(),
  email: email().required(),
  phoneNo: phone().required(),
  from: Joi.string().required(),
  to: Joi.string().required(),
  maxSpace: Joi.number().integer().min(1).required(),
  ratePerHour: Joi.number().positive().required(),
  latitude: lat().required(),
  longitude: lng().required(),
  fileUrls: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
});

export const rentDetails = Joi.object({
  providerId: objectId().required(),
});
