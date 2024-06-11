import mongoose, { model } from "mongoose";
// import validator from "validator";
// import { Validator } from "mongoose";
// import moment from "moment-timezone";
// import moment from 'moment';
// import 'moment-timezone';   
const { Schema } = mongoose;

const PaymentSchema = new Schema({
 
  razorpay_subscription_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // validate: validator.isEmail,
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: 'inactive',
  },
});
export default model("payments", PaymentSchema);

