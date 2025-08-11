// import mongoose from "mongoose";

// export const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI);
//     console.log(`MongoDB Connected: ${conn.connection.host}`);
//   } catch (error) {
//     console.log("Error in connecting to MongoDB", error);
//     process.exit(1); // 1 means failure
//   }
// };



import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI); // debug log
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to MongoDB", error);
    process.exit(1);
  }
};
