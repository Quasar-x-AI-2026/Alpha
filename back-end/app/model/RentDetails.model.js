import mongoose from "mongoose";
import SpaceProvider from "./SpaceProvider.model.js";
import SpaceRenter from "./SpaceRenter.model.js"; 

const rentDetailSchema = new mongoose.Schema(
  {
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: "SpaceProvider" },
    renterId: { type: mongoose.Schema.Types.ObjectId, ref: "SpaceRenter" },
    spotIndex: Number,
    from: Date,
    to: Date,
    vehicleNo: String,
  },
  { timestamps: true }
);

export default mongoose.model("RentDetail", rentDetailSchema);
