import mongoose, { Connection } from "mongoose";

const dbConnectionString =
  process.env.DB_CONNECTION_STRING ||
  "mongodb+srv://mentorshipatweb:mentorship@mentorship.rtuihiw.mongodb.net";

const connectToMongoDB = async (): Promise<Connection> => {
  try {
    const connection = await mongoose.connect(dbConnectionString);
    console.log(`DataBase connected ON : ${connection.connection.host}`);
    return connection.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectToMongoDB;
