import mongoose from "mongoose";

const spaceRenterSchema = new mongoose.Schema({
  userName: String,
  email: { type: String, unique: true },
  password: String,
  phoneNo: Number
}, { timestamps: true });

export default mongoose.model("SpaceRenter", spaceRenterSchema);
