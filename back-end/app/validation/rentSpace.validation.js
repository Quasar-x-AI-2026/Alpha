import Joi from "joi";
import { objectId, email, phone, lat, lng, isoDateTime, vehicleNo } from "./common.js";

export const login = Joi.object({
  email: email().required(),
  password: Joi.string().min(4).required(),
});

export const addUser = Joi.object({
  userName: Joi.string().min(2).required(),
  email: email().required(),
  phoneNo: phone().required(),
  password: Joi.string().min(6).required(),
});

export const getMarker = Joi.object({
  latitude: lat().required(),
  longitude: lng().required(),
  from: isoDateTime().required(),
  to: isoDateTime().required(),
});

export const bookTicket = Joi.object({
  providerId: objectId().required(),
  renterId: objectId().required(),
  spotIndex: Joi.number().integer().min(0).required(),
  from: isoDateTime().required(),
  to: isoDateTime().required(),
  vehicleNo: vehicleNo().required(),
  ratePerHour: Joi.number().positive().required(),
});
