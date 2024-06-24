import mongoose, { model } from "mongoose";
const { Schema } = mongoose;

const MasterLeadSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, required: true },
  additionalFields: { type: Schema.Types.Mixed, default: {} }
});

export default model("MasterLead", MasterLeadSchema);
