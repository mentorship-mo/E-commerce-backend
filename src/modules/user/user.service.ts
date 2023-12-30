import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { sendVerificationEmail } from "../../middleware/send.email";
import { User } from "../../utils/types";
import { userRepoType } from "./user.repo";
import { verificationToken } from "../../middleware/send.email";

export class UserService {
  private readonly repo: userRepoType;

  constructor(repo: userRepoType) {
    this.repo = repo;
  }
  async createUser(userData: User): Promise<void> {
    try {
      await this.repo.createUser(userData);
      userData.verificationToken = verificationToken(userData.id);
      if (!userData.verificationToken) {
        throw new Error("Failed to generate verification token");
      }
      sendVerificationEmail(userData.email, userData.verificationToken);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async authenticateUser(email: string, password: string): Promise<boolean> {
    try {
      const user = await this.repo.getUserByEmail(email);

      if (!user) {
        // user not found with the provided email
        return false;
      }

      // check if password nmatch
      const passwordsMatch = await bcrypt.compare(password, user.password);

      return passwordsMatch;
    } catch (error) {
      console.error("error authenticating user:", error);
      throw error;
    }
  }
  verifyEmail = async (verificationToken: string): Promise<void> => {
    const decoded = jwt.verify(verificationToken, "secret");
    if (!decoded) {
      throw new Error("login first");
    }
    console.log("Decoded Token:", decoded);

    // user.verified = true;
    // user.verificationToken = "";
    // user.save();

    const user = await this.repo.verifyEmail(verificationToken);
    if (!user) {
      throw new Error("Failed to verify email");
    }
    user.verified = true;
    user.verificationToken = "";
    user.save();
  };
  ResendVerificationEmail = async (email: string): Promise<void> => {
    const user = await this.repo.getUserByEmail(email);
    if (!user) {
      throw new Error("Email Not Found");
    }
    user.verificationToken = verificationToken(user.id);
    sendVerificationEmail(user.email, user.verificationToken);
  };

  getLoggedUserDataByToken = async (token: string): Promise<User | null> => {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      ) as {
        email: string;
      };
      const email = decoded.email;
      return await this.repo.getUserByEmail(email);
    } catch (error) {
      console.error("This is not a valid token ", error);
      throw error;
    }
  };
  async enableFARequest(email: string) {
    try {
      const token = verificationToken(email);
      await this.repo.getUserByEmail(email);
      sendVerificationEmail(email, token);
    } catch (error) {
      console.log(error);
    }
  }
  async enableFA(token: string) {
    try {
      const decoded = await jwt.verify(token, "secret");
      if (!decoded) {
        throw new Error("login first");
      }
    } catch (error) {
      console.log(error);
    }
  }
}
