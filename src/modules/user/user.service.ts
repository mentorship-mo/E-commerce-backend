<<<<<<< HEAD
import { sendVerificationEmail } from "../../middleware/send.email";
import { User } from "../../utils/types";
import { userRepoType } from "./user.repo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verificationToken } from "../../middleware/send.email";
import { Tokens } from "../../utils/types";
=======
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { sendVerificationEmail } from "../../middleware/send.email";
import { User } from "../../utils/types";
import { userRepoType } from "./user.repo";
import { verificationToken } from "../../middleware/send.email";
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac

export class UserService {
  private readonly repo: userRepoType;

  constructor(repo: userRepoType) {
    this.repo = repo;
  }
  async createUser(userData: User): Promise<void> {
    try {
<<<<<<< HEAD
      userData.verificationToken = verificationToken(userData.id);
      await this.repo.createUser(userData);
=======
      await this.repo.createUser(userData);
      userData.verificationToken = verificationToken(userData.id);
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
      if (!userData.verificationToken) {
        throw new Error("Failed to generate verification token");
      }
      sendVerificationEmail(userData.email, userData.verificationToken);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

<<<<<<< HEAD
  async authenticateUser(email: string, password: string): Promise<User> {
=======
  async authenticateUser(email: string, password: string): Promise<boolean> {
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
    try {
      const user = await this.repo.getUserByEmail(email);

      if (!user) {
        // user not found with the provided email
<<<<<<< HEAD
        throw new Error("invalid credentials");
=======
        return false;
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
      }

      // check if password nmatch
      const passwordsMatch = await bcrypt.compare(password, user.password);

<<<<<<< HEAD
      if (!passwordsMatch) {
        throw new Error("invalid credentials");
      }
      return user;
=======
      return passwordsMatch;
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
    } catch (error) {
      console.error("error authenticating user:", error);
      throw error;
    }
  }
  verifyEmail = async (verificationToken: string): Promise<void> => {
    const decoded = jwt.verify(verificationToken, "secret");
<<<<<<< HEAD
=======
    if (!decoded) {
      throw new Error("login first");
    }
    console.log("Decoded Token:", decoded);

    // user.verified = true;
    // user.verificationToken = "";
    // user.save();
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac

    const user = await this.repo.verifyEmail(verificationToken);
    if (!user) {
      throw new Error("Failed to verify email");
    }
<<<<<<< HEAD
    console.log("Decoded Token:", decoded);

=======
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
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

<<<<<<< HEAD
  getLoggedUserDataByToken = async (
    token: string
  ): Promise<User | null | void> => {
    try {
      const decoded = (await jwt.verify(token, "secret")) as { _id: string };
      const id = decoded._id;
      return await this.repo.getUserById(id);
    } catch (error) {
      // console.error("Error decoding token or fetching user data:", error);
      // throw error;
    }
  };

  getDataByRefreshToken = async (token: string): Promise<Tokens | null> => {
    try {
      const decoded = (await jwt.verify(token, "refreshTokenSecret")) as {
        _id: string;
      };
      const id = decoded._id;
      const accessToken = await jwt.sign({ id }, "secret", { expiresIn: "1h" });
      const refreshToken = await jwt.sign({ id }, "refreshTokenSecret", {
        expiresIn: "30d",
      });
      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  };
=======
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
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
}
