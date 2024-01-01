import express, { RequestHandler, Request, Response } from "express";
import { UserService } from "./user.service";
import { Tokens, User } from "../../utils/types";
import jwt from "jsonwebtoken";
import { generateImageWithText } from "../../middleware/imgGenerator";

class UserController {
  private router = express.Router();

  private readonly service: UserService;

  constructor(service: UserService) {
    this.service = service;
  }
  authSignIn: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;

      // assuming UserService has a method for authentication
      const isAuthenticated = await this.service.authenticateUser(
        email,
        password
      );

      if (isAuthenticated) {
        const accessToken = await jwt.sign(
          { _id: isAuthenticated.id },
          "secret",
          {
            expiresIn: "1h",
          }
        );
        const refreshToken: string = await jwt.sign(
          { _id: isAuthenticated.id },
          "refreshTokenSecret",
          {
            expiresIn: "30d",
          }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 2592000000,
        });
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 3600000,
        });
        res.status(200).send({
          message: "user authenticated successfully",
          accessToken,
          refreshToken,
        });
      } else {
        res.status(401).send({ message: "Invalid email or password" });
      }
    } catch (err) {
      // console.log(err);
      res.status(500).send({ err });
    }
  };
  createUser: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user: User = req.body;
      const imgName = generateImageWithText(req.body.name || "");
      user.image = imgName;
      await this.service.createUser(user);
      res.status(201).send({ message: "User created successfully" });
    } catch (err) {
      res.status(500).send({ error: err });
    }
  };
  verifyEmail: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const verificationToken = req.params.token;
      await this.service.verifyEmail(verificationToken);
      res.status(201).json({ message: "Email verified successfully" });
    } catch (error) {
      // console.log(error);
      res.status(500).json("Internal Server Error");
    }
  };
  ResendVerificationEmail: RequestHandler = async (req, res, next) => {
    try {
      const email = req.body.email;
      await this.service.ResendVerificationEmail(email);
      res.status(200).json({ msg: "email resend successfully" });
    } catch (error) {
      res.status(500).json("Internal Server Error");
    }
  };
  getUserDataByToken: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const jwtCookie = req.cookies.accessToken as string | undefined;
    if (!jwtCookie) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const userData = await this.service.getLoggedUserDataByToken(jwtCookie);
      if (!userData) {
        res.status(500).json({ error: "There is no users for this Token" });
        return;
      }
      res.status(200).json({
        data: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          Image: userData.image,
        },
      });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  };
  getUserDataByRefreshToken: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const jwtCookie = req.cookies.refreshToken as string | undefined;
    if (!jwtCookie) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const tokens: Tokens | null = await this.service.getDataByRefreshToken(
        jwtCookie
      );
      if (!tokens) {
        res.status(500).json({ error: "There is no users for this Token" });
        return;
      }
      res.status(200).json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      // console.error(error);
      res.status(500).json({ error });
      return;
    }
  };

  initRoutes() {
    this.router.post("/", this.createUser);
    this.router.post("/signin", this.authSignIn);
    this.router.get("/verify-email/:token", this.verifyEmail);
    this.router.get("/Resend-verify-email", this.ResendVerificationEmail);
    this.router.get("/me", this.getUserDataByToken);
    this.router.get("/refreshToken", this.getUserDataByRefreshToken);
  }
  getRouter() {
    return this.router;
  }
}

export default UserController;
