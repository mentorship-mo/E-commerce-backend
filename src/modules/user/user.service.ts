import { sendVerificationEmail } from "../../middleware/send.email";
import { User } from "../../utils/types";
import { userRepoType } from "./user.repo";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { verificationToken } from "../../middleware/send.email";

export class UserService {
  private readonly repo: userRepoType;

  constructor(repo: userRepoType) {
    this.repo = repo;
  }
  async createUser(userData: User): Promise<void> {
    try {
      userData.verificationToken = verificationToken(userData.id);
      await this.repo.createUser(userData);
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

    const user = await this.repo.verifyEmail(verificationToken);
    if (!user) {
      throw new Error("Failed to verify email");
    }
    console.log('Decoded Token:', decoded);

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
  async getLoggedUserDataByToken(token: string): Promise<User | null> {
    try {
      const decodedToken = jwt.verify(token, "secret") as { userId: string };
      const userId = decodedToken.userId;
      return await this.repo.getUserById(userId);
    } catch (error) {
      console.error("Error decoding token or fetching user data:", error);
      throw error;
    }
  }
}

