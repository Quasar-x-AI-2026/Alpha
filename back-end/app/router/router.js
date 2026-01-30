// app/router/router.js
import express from "express";

import * as manageSpace from "../controller/manageSpace.controller.js";
import * as rentSpace from "../controller/rentSpace.controller.js";
import * as admin from "../controller/admin.controller.js";

import {
  uploadMiddleware,
  uploadHandler,
} from "../controller/fileUpload.controller.js";

import { errorHandler } from "../controller/errorHandler.controller.js";

const router = express.Router();

// -------------------- Manage Space (Provider) --------------------
router.post("/api/manage-space/login", manageSpace.login);
router.post("/api/manage-space/add-user", manageSpace.addUser);
router.post("/api/manage-space/get-rent-details", manageSpace.rentDetails);

// -------------------- Rent Space (Renter) --------------------
router.post("/api/rent-space/login", rentSpace.login);
router.post("/api/rent-space/add-user", rentSpace.addUser);
router.post("/api/rent-space/get-marker", rentSpace.getMarker);
router.post("/api/rent-space/book-ticket", rentSpace.bookTicket);
router.post("/api/rent-space/booked", rentSpace.booked);
router.post("/api/rent-space/history", rentSpace.history);

// -------------------- Admin --------------------
router.post("/api/admin/login", admin.login);
router.post("/api/admin/change-status", admin.changeStatus);

// -------------------- Upload --------------------
router.post("/api/upload", uploadMiddleware, uploadHandler);

// -------------------- Error Handler (LAST) --------------------
router.use(errorHandler);

export default router;
