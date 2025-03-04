// models/Profile.js
import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  teach: { type: String, required: true },
  learn: { type: String, required: true },
  twitterHandle: { type: String, required: true },
  img: { type: String },
  name: { type: String },
  Tid: {type: String}
});

// Prevent model overwrite in development
export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
