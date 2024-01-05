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
    console.log("Decoded Token:", decoded);

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
      const decoded = (await jwt.verify(token, "secret")) as { email: string };
      const email = decoded.email;
      return await this.repo.getUserByEmail(email);
    } catch (error) {
      console.error("Error decoding token or fetching user data:", error);
      throw error;
    }
  };
  getAccessTokenByRefreshToken = async (token: string) => {
    try {
      const decoded = (await jwt.verify(token, "refreshTokenSecret")) as {
        email: string;
      };
      const email = decoded.email;
      const accessToken = await jwt.sign({ email }, "secret", {
        expiresIn: "1h",
      });
      return accessToken;
    } catch (error) {
      console.error("Error decoding token or fetching user data:", error);
      throw error;
    }
  };
}
