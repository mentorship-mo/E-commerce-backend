<<<<<<< HEAD
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
=======
import express, { RequestHandler } from "express";
import { UserService } from "./user.service";
import { User } from "../../utils/types";
import jwt from "jsonwebtoken";
import { userRepoType } from "./user.repo";
import { generateImageWithText } from "../../utils/image.generator";

class UserController {
  private router = express.Router();
  private readonly service: UserService;
  private repo: userRepoType;

  constructor(service, repo) {
    this.service = service;
    this.repo = repo;
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
  }
  authSignIn: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;

<<<<<<< HEAD
      // assuming UserService has a method for authentication
=======
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
      const isAuthenticated = await this.service.authenticateUser(
        email,
        password
      );

      if (isAuthenticated) {
<<<<<<< HEAD
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
=======
        const user: User | null = await this.repo.getUserByEmail(email);

        if (user) {
          const token = jwt.sign(
            { email },
            process.env.JWT_SECRET_KEY as string,
            {
              expiresIn: process.env.JWT_EXPIRATION_TIME as string,
            }
          );

          res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });

          res.status(200).send({
            message: "User authenticated successfully",
          });
        } else {
          // Handle the case where the user is null
          res.status(500).send("Internal Server Error");
        }
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
      } else {
        res.status(401).send({ message: "Invalid email or password" });
      }
    } catch (err) {
<<<<<<< HEAD
      // console.log(err);
      res.status(500).send({ err });
    }
  };
  createUser: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user: User = req.body;
      const imgName = generateImageWithText(req.body.name || "");
=======
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };

  createUser: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user: User = req.body;
      const imgName = await generateImageWithText(req.body.name || "");
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
      user.image = imgName;
      await this.service.createUser(user);
      res.status(201).send({ message: "User created successfully" });
    } catch (err) {
<<<<<<< HEAD
      res.status(500).send({ error: err });
=======
      console.log(err);

      res.status(500).send("Internal Server Error");
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
    }
  };
  verifyEmail: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const verificationToken = req.params.token;
      await this.service.verifyEmail(verificationToken);
      res.status(201).json({ message: "Email verified successfully" });
    } catch (error) {
<<<<<<< HEAD
      // console.log(error);
=======
      console.log(error);
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
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
<<<<<<< HEAD
  getUserDataByToken: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const jwtCookie = req.cookies.accessToken as string | undefined;
    if (!jwtCookie) {
      res.status(401).json({ error: "Unauthorized" });
=======
  getUserDataByToken: RequestHandler = async (req, res): Promise<void> => {
    const jwtCookie = req.cookies.jwt as string | undefined;
    if (!jwtCookie) {
      res.status(401).json({ error: "You are not logged in " });
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
      return;
    }

    try {
      const userData = await this.service.getLoggedUserDataByToken(jwtCookie);
<<<<<<< HEAD
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
=======
      // console.log(userData);

      res.status(200).json({
        id: userData?.id,
        name: userData?.name,
        email: userData?.email,
        Image: userData?.image,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  enableFARequest: RequestHandler = async (req, res) => {
    try {
      const { email } = req.body;
      await this.service.enableFARequest(email);
      res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.log(error);
    }
  };
  enableFA: RequestHandler = (req, res) => {
    try {
      const token: string | undefined = req.query.token as string | undefined;
      if (token === undefined) {
        res.status(404).json({ msg: "token is missing" });
        return;
      }
      this.service.enableFA(token);
      res.status(200).json({ message: "2FA enabled successfully" });
    } catch (error) {
      console.log(error);
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
    }
  };

  initRoutes() {
    this.router.post("/", this.createUser);
    this.router.post("/signin", this.authSignIn);
    this.router.get("/verify-email/:token", this.verifyEmail);
    this.router.get("/Resend-verify-email", this.ResendVerificationEmail);
    this.router.get("/me", this.getUserDataByToken);
<<<<<<< HEAD
    this.router.get("/refreshToken", this.getUserDataByRefreshToken);
=======
    this.router.post("/enable-2fa-Request", this.enableFARequest);
    this.router.post("/enable-2fa", this.enableFA);
>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
  }
  getRouter() {
    return this.router;
  }
}

export default UserController;
