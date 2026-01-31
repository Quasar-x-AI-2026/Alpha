// app/router/router.js
import express from "express";

import * as manageSpace from "../controller/manageSpace.controller.js";
import * as rentSpace from "../controller/rentSpace.controller.js";
import { createCheckoutSession } from "../controller/stripe.controller.js";
import * as admin from "../controller/admin.controller.js";
import { chatWithBot } from "../controller/chatbot.controller.js";


import {
  uploadMiddleware,
  uploadHandler,
} from "../controller/fileUpload.controller.js";

import { errorHandler } from "../controller/errorHandler.controller.js";
import validate from "../middleware/validate.js";
import * as adminVal from "../validation/admin.validation.js";
import * as manageVal from "../validation/manageSpace.validation.js";
import * as rentVal from "../validation/rentSpace.validation.js";

const router = express.Router();

// -------------------- Manage Space (Provider) --------------------
router.post("/api/manage-space/login", validate(manageVal.login), manageSpace.login);
router.post("/api/manage-space/add-user", validate(manageVal.addUser), manageSpace.addUser);
router.post("/api/manage-space/get-rent-details", validate(manageVal.rentDetails), manageSpace.rentDetails);

// -------------------- Rent Space (Renter) --------------------
router.post("/api/rent-space/login", validate(rentVal.login), rentSpace.login);
router.post("/api/rent-space/add-user", validate(rentVal.addUser), rentSpace.addUser);
router.post("/api/rent-space/get-marker", validate(rentVal.getMarker), rentSpace.getMarker);
router.post("/api/rent-space/book-ticket", validate(rentVal.bookTicket), rentSpace.bookTicket);
router.post("/api/rent-space/booked", rentSpace.booked);
router.post("/api/rent-space/history", rentSpace.history);

// -------------------- Payments --------------------
router.post("/create-checkout-session", createCheckoutSession);

// -------------------- Admin --------------------
router.post("/api/admin/login", validate(adminVal.login), admin.login);
router.post("/api/admin/change-status", validate(adminVal.changeStatus), admin.changeStatus);

// -------------------- Upload --------------------
router.post("/api/upload", uploadMiddleware, uploadHandler);
router.post("/chat", chatWithBot);


// -------------------- Error Handler (LAST) --------------------
router.use(errorHandler);

export default router;
