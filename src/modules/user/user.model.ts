import { Schema, model } from "mongoose";
import { User } from "../../utils/types";
// Define the user schema

const UserSchema = new Schema<User>(
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
export const UserModel = model<User>("User", UserSchema);
