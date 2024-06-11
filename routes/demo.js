import "dotenv/config.js"
import Payment from "../models/Payment.js"
import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const secretKey = "secretKey";
import bcrypt from "bcryptjs";
const router = express.Router();


// instance of razorpay
const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});


// testing the api 
router.get("/", (req, res) => {
  res.status(200).send({
    msg: "APIs are working successfully",
  });
});


// ROUTE 1 : Create Order Api Using POST Method http://localhost:4000/api/payment/subscription

router.post("/subscription", async (req,res) => {
    const options = {
        plan_id: "plan_NxhIybqBiYaDx2", // live plan curiotory
        // plan_id: "plan_OJmqrAJKPTySg6", // demo plan curiotory
        customer_notify: 1,
        total_count: 12, // Total number of billing cycles, for a monthly subscription for a year
    }
    
    razorpayInstance.subscriptions.create(options,(error,order) => {
        if(error){
            return res.status(500).json({
                message: "Not able to create the subscription"
            })
        }
        res.status(200).json({
            success:true,
            data:order
        })
        console.log(order);
    });

})


//  ROUTE 2: Create Verify Api usign the POST Method http://localhost:4000/api/payment/verification

router.post("/verification", async(req,res) =>{


    const {
        razorpay_subscription_id,
        razorpay_payment_id,
        razorpay_signature,
        fullName,
        phone,
        email,
        password,
      } = req.body;


      const hashedPassword = await bcrypt.hash(password, 10);

      const payment = new Payment({
        razorpay_subscription_id,
        razorpay_payment_id,
        razorpay_signature,
        fullName,
        phone,
        email,
        password: hashedPassword,
        status: "active", // Set status to active on successful payment
      });

      await payment.save();
      console.log("Payment schema:", payment);
      return res.json({ message: "Subscription Payment Successful" });
    
     
})


// ROUTE 2: Create Verify Api using the POST Method http://localhost:4000/api/payment/verification
// router.post("/verification", async (req, res) => {
//   const {
//     razorpay_subscription_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     fullName,
//     phone,
//     email,
//     password,
//   } = req.body;

//   try {
//     // Debugging: Log each individual value
//     console.log("Razorpay Subscription ID:", razorpay_subscription_id);
//     console.log("Razorpay Payment ID:", razorpay_payment_id);
//     console.log("Razorpay Signature:", razorpay_signature);

//     const sign = `${razorpay_subscription_id}|${razorpay_payment_id}`;
//     console.log("Generated sign:", sign);

//     const expectedSign = crypto
//       .createHmac("sha256", 'cGxrAh2czvwfwwUw05hi4QNE')
//       .update(sign)
//       .digest("hex");

//     console.log("Expected signature:", expectedSign);
//     console.log("Received signature:", razorpay_signature);

//     if (expectedSign !== razorpay_signature) {
//       return res.status(400).json({ message: "Transaction is not legit" });
//     }

//     const payment = new Payment({
//       razorpay_subscription_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       fullName,
//       phone,
//       email,
//       password,
//       status: "active", // Set status to active on successful payment
//     });

//     await payment.save();
//     console.log("Payment schema:", payment);
//     return res.json({ message: "Subscription Payment Successful" });
//   } catch (error) {
//     res.status(500).json({ message: "Internal Server Error" });
//     console.error("Error verifying subscription:", error);
//   }
// });




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