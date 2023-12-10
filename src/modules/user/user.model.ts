import { Schema, model, Document } from "mongoose";

// Define the user schema
interface IUser {
  id: string;
  password: string;
  email: string;
  name: string;
  oAuthToken?: "google" | "facebook";
  otp?: string;
}

const UserSchema = new Schema<IUser, Document>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    oAuthToken: { type: String, enum: ["google", "facebook"], required: true },
    otp: { type: String, default: "" },
  },
  { timestamps: true }
);

// Create and export the User model
export const UserModel = model<IUser, Document>("User", UserSchema);
