import { sendVerificationEmail } from "../../middleware/send.email";
import { User } from "../../utils/types";
import { userRepoType } from "./user.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verificationToken } from "../../middleware/send.email";

export class UserService {
  private readonly repo: userRepoType;

  constructor(repo: userRepoType) {
    this.repo = repo;
  }
  async createUser(userData: User): Promise<void> {
    try {
      await this.repo.createUser(userData);
      userData.verificationToken = verificationToken(userData.id)
      if (!userData.verificationToken) {
        throw new Error("Failed to generate verification token")
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
    const decoded = jwt.verify(verificationToken, "secret")
    if (!decoded) {
      throw new Error("login first")
    }
    const user = await this.repo.verifyEmail(verificationToken)
    if (!user) {
      throw new Error("Failed to verify email")
    }
    user.verified = true
    user.verificationToken = ""
    user.save()
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
      const decoded = (await jwt.verify(token, "secret")) as { email: string };
      const email = decoded.email;
      return await this.repo.getUserByEmail(email);
    } catch (error) {
      console.error("Error decoding token or fetching user data:", error);
      throw error;
    }
  };

  async requestEnable2FAByEmail(email: string): Promise<void> {
    try {
      const user = await this.repo.getUserByEmail(email);
      if (!user) {
        throw new Error('User not found');
      }
      const token = jwt.sign({ userId: user.id }, "2FA_SECRET_KEY", { expiresIn: "1h" });
      // This is a placeholder for sending the token via email
      await this.send2FATokenByEmail(email, token);

    } catch (error) {
      console.error('Error requesting enablement of 2FA:', error);
      throw error;
    }
  }

  async verifyEnable2FAToken(email: string, token: string): Promise<boolean> {
    try {
      const user = await this.repo.getUserByEmail(email);

      if (!user) {
        throw new Error('User not found');
      }
 
      const decodedToken = jwt.verify(token, "2FA_SECRET_KEY") as { userId: string };

      if (!decodedToken || decodedToken.userId !== user.id) {
        return false; // Token is invalid or doesn't match the user
      }

      await this.repo.enable2FAForUser(email);
      return true; // Token is valid, and 2FA enabled

    } catch (error) {
      console.error('Error verifying enable 2FA token:', error);
      throw error;
    }
  }

  // handle sending the 2FA token via email
  private async send2FATokenByEmail(email: string, token: string): Promise<void> {
    //  logic to send the token to the user's email
    // using email service or package to send the token
    console.log(`Sending 2FA token ${token} to ${email}`);
  }

}

