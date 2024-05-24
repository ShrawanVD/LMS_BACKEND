import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import "dotenv/config.js";
import Payment from "../models/Payment.js";
import jwt from "jsonwebtoken";
const secretKey = "secretKey";
import bcrypt from "bcryptjs";


import moment from "moment-timezone";

const router = express.Router();

// instance for razorpay
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

const secret = process.env.RAZORPAY_SECRET;

// ---------------------------------- RECURRING SUBSCRIPTIONS ------------------------------

// ROUTE 1 : Create Order Api Using POST Method http://localhost:4000/api/payment/create-subscription

router.post("/create-subscription", async (req, res) => {
  const { fullName, phone, email, password } = req.body;

  try {
    // const hashedPassword = await bcrypt.hash(password, 10); 
    // console.log(hashedPassword); 
    const options = {
      plan_id: "plan_OBWrpv6aIRAf8m", // Replace with your actual plan ID from Razorpay
      customer_notify: 1,
      total_count: 12, // Total number of billing cycles, for a monthly subscription for a year
      notify_info: {
        notify_phone: phone,
        notify_email: email,
      },
      // amount: Number(amount * 100),
      // currency: "INR",
      // receipt: crypto.randomBytes(10).toString("hex"),
    };

    const subscription = razorpayInstance.subscriptions.create(options);
    res.status(200).json({ subscription });
    // console.log(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});

// ROUTE 1 : Create verfiy Api Using POST Method http://localhost:4000/api/payment/verify-subscription

router.post("/verify-subscription", async (req, res) => {
  const {
    razorpay_subscription_id,
    razorpay_payment_id,
    razorpay_signature,
    fullName,
    phone,
    email,
    password,
  } = req.body;

  // console.log("Request body:", req.body);

  // if (!razorpay_subscription_id || !razorpay_payment_id || !razorpay_signature ) {
  //   return res.status(400).json({ message: "All payment details are required" });
  // }

  try {
    const secret = process.env.RAZORPAY_SECRET;
    if (!secret) {
      console.error("RAZORPAY_SECRET is not defined");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    const sign = razorpay_subscription_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", secret)
      .update(sign.toString())
      .digest("hex");

    // console.log("Expected signature:", expectedSign);
    // console.log("Received signature:", razorpay_signature);

    if (expectedSign === razorpay_signature) {
      const payment = new Payment({
        razorpay_subscription_id,
        razorpay_payment_id,
        razorpay_signature,
        fullName,
        phone,
        email,
        password,
        status: "active", // Set status to active on successful payment
      });

      await payment.save();
      // console.log("Payment schema:", payment);
      return res.json({ message: "Subscription Payment Successful" });
    } else {
      return res.status(400).json({ message: "Transaction is not legit" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.error("Error verifying subscription:", error);
  }
});

// -------------------------------------- ONE TIME PAYMENT ------------------------------------

// ROUTE 1 : Create Order Api Using POST Method http://localhost:4000/api/payment/order

router.post("/order", (req, res) => {
  // amount is fetched
  const { amount } = req.body;

  // try catch statement

  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something went wrong" });
      }
      res.status(200).json({ data: order });
      // console.log(order);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
});

// ROUTE 2 : Create Verify Api Using POST Method http://localhost:4000/api/payment/verify

router.post("/verify", async (req, res) => {
  // fetch razorpay details:
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    fullName,
    phone,
    email,
    password,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !fullName ||
    !phone ||
    !email ||
    !password
  ) {
    return res
      .status(400)
      .json({ message: "All payment details are required" });
  }

  // console.log("req body:", req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if the secret key is available before proceeding
    if (!secret) {
      console.error("RAZORPAY_SECRET is not defined");
      return res.status(500).json({ message: "Internal Server Error" });
    }

    // create sign
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    // expected sign
    const expectedSign = crypto
      .createHmac("sha256", secret)
      .update(sign.toString())
      .digest("hex");

    // comparing signatures
    const isAuthentic = expectedSign === razorpay_signature;
    // console.log(isAuthentic);

    // if found same, save details in mongodb
    if (isAuthentic) {
      const payment = new Payment({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        fullName,
        phone,
        email,
        password: hashedPassword,
        status: "active", // Set status to active on successful payment
      });

      // console.log("payment schema is: " + payment);

      // Redirect the user to the subscription link
      //  res.status(200).json({ subscriptionLink: "https://rzp.io/i/W5MQ1I3oM" });

      // displaying the date in IST which is stored by default in UTC by Moongose (for further use)
      const istDate = moment(payment.date).tz("Asia/Kolkata").format();
      // console.log("The IST Date for payment done is: " + istDate);

      // Save Payment
      await payment.save();

      // Send Message
      res.json({
        message: "Payment Successful",
      });
    }
  } catch (error) {
    res.status(400).json({ message: "Transaction is not Legit" });
    console.log(error);
  }
});

// -----------------------------------User login api-----------------------------------

// Authenticate user function
const authenticateUser = async (email, password) => {
  const user = await Payment.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    return user;
  }
  return null;  
};

// login api for generating token
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body);

  try {
    const user = await authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    jwt.sign({ email: user.email,name: user.fullName }, secretKey, { expiresIn: "300s" }, (err, token) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      res.json({ token });
    });
  } catch (error) {
    console.error("Error while logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// profile api for giving the access
router.post("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      res.send({
        message: "Invalid Login",
      });
    } else {
      res.json({
        message: "profile accessed",
        authData,
      });
    }
  });
});

// Middleware for verifying the token
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.send({
      result: "invalid login",
    });
  }
}


export default router;
