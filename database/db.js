


import mongoose from "mongoose";
import "dotenv/config.js";

// const mongoURI = "mongodb+srv://vaibhav:1234@cluster0.24ik1dr.mongodb.net/recrutory?retryWrites=true&w=majority&appName=Cluster0";
 const mongoURI = process.env.MONGO_DB_URI;



const connectToMongo = async () => {
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("*******************connection successful mongoose********************");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
}
  export default connectToMongo;
