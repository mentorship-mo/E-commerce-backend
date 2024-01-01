import { Schema, model } from "mongoose";
import validator from "validator";
import { User } from "../../utils/types";
import bcrypt from "bcryptjs";
// Define the user schema

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
<<<<<<< HEAD
=======
    is2FaEnabled : {
      type: Boolean,
      default: false
    },
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
          if (!validator.isEmail(value)) {
            throw new Error("Email is not valid");
          }
        },
      },
    },
    password: { type: String, required: true, min: 6 },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationToken: { type: String, default: "" },
    oAuthToken: { type: String, enum: ["google", "facebook"] },
    otp: { type: String, default: "" },
    image: String,
  },
<<<<<<< HEAD
  { timestamps: true }
=======
  { timestamps: true },

>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
);

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
    next();
  }
});

// Create and export the User model
export const UserModel = model<User>("User", UserSchema);
