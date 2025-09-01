import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_CONNECTION_STRING}/prescripto`
    );

    console.log(
      `\nMongoDb connected || DB HOST:${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1); 
    // Exiting with a failure code (1) indicates that the application encountered an error during startup.
    // This is important because if the database connection fails,
    // the application likely cannot function correctly, so it's better to stop the process.
  }
};

export default connectDB;
