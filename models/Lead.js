// import { compare } from "bcryptjs";
import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const LeadSchema = new Schema({

  // Defining fixed fields
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "not assigned" },
  language: { type: String, required: true },
  proficiencyLevel: { type: String },
  jbStatus: { type:String },
  qualification: { type: String },
  industry: { type: String },
  domain: { type: String },
  location: { type: String },
  currentCTC: { type: Number },
  expectedCTC: { type: Number },
  noticePeriod: { type: String },
  wfh: { type: String },
  resumeLink: { type: String },
  linkedinLink: { type: String },
  feedback: { type: String },
  company: { type: String },
  voiceNonVoice: { type: String },
  placedBy: { type: String },
  
});

// export default model("Lead", LeadSchema);

const Lead = model("Lead", LeadSchema);

export default Lead;
