import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const LeadSchema = new Schema({
  // Defining fixed fields
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "not assigned" },
});

export default model("Lead", LeadSchema);
