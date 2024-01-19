import mongoose, { Connection } from "mongoose";

const dbConnectionString = process.env.DB_URI;

const connectToMongoDB = async (): Promise<Connection> => {
  try {
    const connection = await mongoose.connect(dbConnectionString as string);
    console.log(`DataBase connected ON : ${connection.connection.host}`);
    return connection.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectToMongoDB;
