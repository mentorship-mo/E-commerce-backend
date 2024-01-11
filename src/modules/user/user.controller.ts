import express, { RequestHandler } from "express";
import { UserService } from "./user.service";
import { User } from "../../utils/types";
import jwt from "jsonwebtoken";
import passport from "passport";
import { generateImageWithText } from "../../utils/image.generator";
import { authMiddleware } from "../../middleware/Authentication";

class UserController {
  private router = express.Router();
  private readonly service: UserService;
  constructor(service: UserService) {
    this.service = service;
  }
  authSignIn: RequestHandler = async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;
      const user: User = await this.service.authenticateUser(email, password);

      if (user) {
        const accessToken = await jwt.sign({ email, id: user.id }, "secret", {
          expiresIn: "1h",
        });
        const refreshToken = await jwt.sign(
          { email, id: user.id },
          "refreshTokenSecret",
          {
            expiresIn: "30d",
          }
        );
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 3600000,
        });
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          maxAge: 2592000000,
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
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  };
  createUser: RequestHandler = async (req, res): Promise<void> => {
    try {
      const user: User = req.body;
      const imgName = await generateImageWithText(req.body.name || "");
      user.image = imgName;
      await this.service.createUser(user);
      res.status(201).send({
        message: "User created successfully, check your email to verify",
      });
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
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
  };

  getRefreshToken: RequestHandler = async (req, res): Promise<void> => {
    const jwtCookie = req.cookies.refreshToken as string | undefined;
    if (!jwtCookie) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    try {
      const accessToken = await this.service.getAccessTokenByRefreshToken(
        jwtCookie
      );
      if (!accessToken) {
        res.status(500).json({ error: "There is no users for this Token" });
        return;
      }

      res.send({ accessToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
      return;
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
    }
  };
  googleLogin: RequestHandler = (req, res, next) => {
    try {
      passport.authenticate("google", { scope: ["profile", "email"] })(
        req,
        res,
        next
      );
    } catch (error) {
      console.log(error);
    }
  };
  googleRedirect: RequestHandler = (req, res, next) => {
    passport.authenticate(
      "google",
      { failureRedirect: "/login" },
      (err, user) => {
        if (err) {
          return res.status(500).json({ error: err });
        }
        if (!user) {
          return res.status(401).json({ error: "Authentication failed" });
        }
        res.status(200).json({ user });
      }
    )(req, res, next);
  };
  updateAddresses: RequestHandler = async (req, res, next) => {
    try {
      const userId: any = req.user;
      const { addresses } = req.body;
      const user = await this.service.updateAddresses(userId, addresses);
      res.status(200).json({ msg: "updated successfully", user });
    } catch (error) {
      console.log(error);
    }
  };
  updateName: RequestHandler = async (req, res) => {
    const { name } = req.body;
    const token = req.cookies.accessToken as string;
    try {
      const user = await this.service.updateUserName(name, token);
      if (!user) {
        return res.send({ msg: "user is not found" });
      }
      res.send({ msg: "User has been updated successfully" });
    } catch (err) {
      res.status(500).send({ msg: "Internal server error" });
    }
  };
  updateEmail: RequestHandler = async (req, res, next) => {
    const { userId, password, newEmail } = req.body;
    try {
        await this.service.updateEmail(userId, password, newEmail);
        res.status(200).json({ message: "Email updated successfully" });
      
    } catch (error) {
      console.error("Error updating email:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  initRoutes() {
    this.router.post("/", this.createUser);
    this.router.post("/signin", this.authSignIn);
    this.router.get("/verify-email/:token", this.verifyEmail);
    this.router.get("/Resend-verify-email", this.ResendVerificationEmail);
    this.router.get("/refresh-token", this.getRefreshToken);
    this.router.get("/me", this.getUserDataByToken);
    this.router.post("/enable-2fa-Request", this.enableFARequest);
    this.router.post("/enable-2fa", this.enableFA);
    this.router.get("/google", this.googleLogin);
    this.router.get("/google/redirect", this.googleRedirect);
    this.router.put(
      "/update-addresses",
      authMiddleware.authenticate,
      this.updateAddresses
    );
    this.router.patch("/update-user", this.updateName);
    this.router.put(
      "/update-email",
      authMiddleware.authenticate,
      this.updateEmail
    );
  }
  getRouter() {
    return this.router;
  }
}

export default UserController;
