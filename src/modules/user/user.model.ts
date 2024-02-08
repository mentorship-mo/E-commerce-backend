import { Schema, model } from "mongoose";
import validator from "validator";
import { User } from "../../utils/types";
import bcrypt from "bcryptjs";
// Define the user schema

const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    is2FaEnabled: {
      type: Boolean,
      default: false,
    },
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
    password: {
      type: String,
      min: 6,
      required() {
        return this.authProvider === "Local";
      },
    },
    verified: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        street: String,
        city: String,
        zipCode: Number,
        name : String ,
        isDefault : Boolean
      },
    ],
    oAuthToken: { type: String },
    authProvider: { type: String, enum: ["Local", "Google"], default: "Local" },
    otp: { type: String, default: "" },
    image: String,
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

UserSchema.pre("save", async function (next) {
  const user = this;
  if (user.authProvider === "Local" && user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
    next();
  }
});
UserSchema.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

// Create and export the User model
export const UserModel = model<User>("User", UserSchema);
