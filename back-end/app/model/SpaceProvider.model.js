import mongoose from "mongoose";

const spaceProviderSchema = new mongoose.Schema({
  fullName: String,
  spaceName: String,
  email: { type: String, unique: true },
  password: String,
  phoneNo: Number,

  latitude: Number,
  longitude: Number,

  from: String,
  to: String,

  maxSpace: Number,
  ratePerHour: Number,

  fileUrls: [String],
  status: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("SpaceProvider", spaceProviderSchema);
