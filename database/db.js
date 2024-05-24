
// import { mongoose } from "mongoose";
// import {MongoClient} from "mongodb";

// const mongoURI =
//   "mongodb+srv://vaibhav:1234@cluster0.24ik1dr.mongodb.net/recrutory?retryWrites=true&w=majority&appName=Cluster0";
// mongoose
//   .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log("*******************connection successfull moongose********************");
//   })
//   .catch((err) => console.log(err));

// const connectToMongo = async () => {
//   const client = new MongoClient(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   try {
//     await client.connect();
//     const db = client.db("recrutory");
//     console.log("*******************connection successfull mongo ********************");
//   } catch (error) {
//     console.log(error);
//   }
// };

// export default connectToMongo;



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
