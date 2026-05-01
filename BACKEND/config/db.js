import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo DB connected ...");
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

export default connectDB;
