import express, { RequestHandler } from "express";
import { UserService } from "./user.service";
import { User } from "../../utils/types";
import jwt from "jsonwebtoken";

class UserController {
  private router = express.Router();

  private readonly service: UserService;

  constructor(service) {
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
        const token = await jwt.sign({ email }, "secret", { expiresIn: "1h" });
        res.cookie("jwt", token, { httpOnly: true, maxAge: 3600000 });
        res.status(200).send({
          message: "user authenticated successfully",
          token,
        });
      } else {
        res.status(401).send({ message: "Invalid email or password" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };
  createUser: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user: User = req.body;
      await this.service.createUser(user);
      res.status(201).send({ message: "User created successfully" });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  };
  verifyEmail: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const verificationToken = req.params.token;
      await this.service.verifyEmail(verificationToken);
      res.status(201).json({ message: "Email verified successfully" });
    } catch (error) {
      console.log(error);
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
  getUserDataByToken: RequestHandler = async (req, res): Promise<void> => {
    const jwtCookie = req.cookies.jwt as string | undefined;
    if (!jwtCookie) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const userData = await this.service.getLoggedUserDataByToken(jwtCookie);
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
  enable2FA: RequestHandler = async (req, res) => {
    try {
      const { email, token } = req.body;
      const is2FAEnabled = await this.service.verifyEnable2FAToken(email, token);
      if (is2FAEnabled) {
        return res.status(200).json({ message: '2FA enabled successfully.' });
      } else {
        return res.status(400).json({ message: 'Invalid token or unable to enable 2FA.' });
      }
    } catch (error) {
      console.error('Error enabling 2FA:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };
  
  requestEnable2FA: RequestHandler = async (req, res) => {
    try {
      const { email } = req.body;
  
      await this.service.requestEnable2FAByEmail(email);
  
      return res.status(200).json({ message: 'Request to enable 2FA sent.' });
    } catch (error) {
      console.error('Error requesting enablement of 2FA:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };

  initRoutes() {
    this.router.post("/", this.createUser);
    this.router.post("/signin", this.authSignIn);
    this.router.get("/verify-email/:token", this.verifyEmail);
    this.router.get("/Resend-verify-email", this.ResendVerificationEmail);
    this.router.get("/get-me", this.getUserDataByToken);
    this.router.post("/enable-2fa-Request",this.requestEnable2FA);
    this.router.post("/enable-2fa",this.enable2FA );

  }
  getRouter() {
    return this.router;
  }
}

export default UserController;
