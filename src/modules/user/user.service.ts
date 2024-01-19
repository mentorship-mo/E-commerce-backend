import { sendVerificationEmail } from "../../middleware/send.email";
import { User } from "../../utils/types";
import { userRepoType } from "./user.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { verificationToken } from "../../middleware/send.email";
import { Profile } from "passport";
import { sendRequstEnable2FA } from "../../middleware/send.Enable2FA";
import { enable2FAToken } from "../../middleware/send.Enable2FA";

export class UserService {
  private readonly repo: userRepoType;

  constructor(repo: userRepoType) {
    this.repo = repo;
  }
  async createUser(userData: User): Promise<void> {
    try {
      userData.verificationToken = verificationToken(userData.id);
      userData.enable2FAToken = enable2FAToken(userData.id);
      await this.repo.createUser(userData);
      if (!userData.verificationToken) {
        throw new Error("Failed to generate verification token");
      }
      sendVerificationEmail(userData.email, 5, userData.verificationToken);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async authenticateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.repo.getUserByEmail(email);

      if (!user) {
        // user not found with the provided email
        throw new Error("User not found");
      }

      // check if password nmatch
      const passwordsMatch = await bcrypt.compare(password, user.password);

      if (!passwordsMatch) {
        throw new Error("Invalid password");
      }

      return user;
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
    sendVerificationEmail(user.email, 5, user.verificationToken);
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

  sendEnable2FAEmail = async (email: string): Promise<void> => {
    const user = await this.repo.getUserByEmail(email);
    if (!user) {
      throw new Error("Email Not Found");
    }
    user.enable2FAToken = enable2FAToken(user.id);
    sendRequstEnable2FA(user.email, 2, user.enable2FAToken);
  };
  async enable2FA(enable2FAToken: string): Promise<void> {
    const decodedToken: any = jwt.verify(enable2FAToken, "secret");

    if (!decodedToken) {
      throw new Error("signing failed");
    }
    console.log("Decoded Token:", decodedToken);

    const user = await this.repo.verify2FA(decodedToken.id);
    if (!user) {
      throw new Error("Failed to verify enable2FA using email");
    }
    user.is2FAEnabled = true;
    user.enable2FAToken = "";
    await user.save();
    //TODO:
    // Send email that 2fa is successful enabled
  }

  async authenticationGoogle(profile: Profile, done: any) {
    try {
      const currentUser = await this.repo.findGoogleId(profile.id);
      console.log("here2");
      if (currentUser) {
        console.log("User exists:", currentUser);
        done(null, currentUser);
      } else {
        const newUser: User = {
          id: profile.id,
          name: profile.displayName,
          email: profile.emails![0].value,
          oAuthToken: profile.id,
          authProvider: "Google",
          image: profile.photos![0].value,
        };

        await this.repo.createUser(newUser);
        done(null, newUser);
      }
    } catch (error) {
      console.log(error);
    }
  }

  updateAddresses = async (
    userId: string,
    addresses: string
  ): Promise<User | undefined> => {
    try {
      const user = await this.repo.updateUserAddresses(userId, addresses);
      if (!user) {
        throw new Error("user not found");
      }
      return user;
    } catch (error) {
      console.log(error);
    }
  };
  async updateUserName(name: string, token: string) {
    const decoded = (await jwt.verify(token, "secret")) as { email: string };
    if (!decoded) {
      throw new Error("you are not authenticated");
    }

    return await this.repo.updateNameByEmail(decoded.email, name);
  }
  async updateEmail(
    userId: string,
    currentPassword: string,
    newEmail: string
  ): Promise<void> {
    try {
      const user = await this.repo.getUserById(userId);

      if (!user) {
        throw new Error("User not found");
      }

      const passwordsMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!passwordsMatch) {
        throw new Error("Incorrect password");
      }

      console.log(this.getLoggedUserDataByToken);
      user.email = newEmail;
      user.verificationToken = verificationToken(user.id);

      await this.repo.updateUserEmail(user);

      if (!user.verificationToken) {
        throw new Error("Failed to generate verification token");
      }

      sendVerificationEmail(newEmail, 5, user.verificationToken);
    } catch (error) {
      console.error("Error updating email:", error);
      throw error;
    }
  }
  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ status: number; message: string }> {
    try {
      // Fetch the user from the database
      const user = await this.repo.findById(userId);

      if (!user) {
        return { status: 404, message: "User not found" };
      }

      // Check if the old password is correct
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

      if (!isPasswordValid) {
        return { status: 401, message: "Invalid old password" };
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password
      await this.repo.updatePassword(userId, hashedPassword);

      return { status: 200, message: "Password updated successfully" };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Internal Server Error" };
    }
  }
}
