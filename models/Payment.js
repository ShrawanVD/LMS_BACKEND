import mongoose, { model } from "mongoose";
// import moment from "moment-timezone";
// import moment from 'moment';
// import 'moment-timezone';   
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  razorpay_order_id: {
    type: String,
    required: true,
  },
  // razorpay_subscription_id: {
  //   type: String,
  //   required: true,
  // },
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
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    default: 'inactive',
  },
});
export default model("payment", PaymentSchema);
