import Joi from "joi";
import { objectId, email } from "./common.js";

export const login = Joi.object({
  email: email().required(),
  password: Joi.string().min(4).required(),
});

export const changeStatus = Joi.object({
  id: objectId().required(),
  status: Joi.number().valid(-1, 0, 1).required(),
});
