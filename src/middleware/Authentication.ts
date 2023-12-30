import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserModel } from "../modules/user/user.model";

class AuthenticationMiddleware {
  async authenticate(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        throw new Error(
          "You are not logged in. Please log in to get access to this route"
        );
      }
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      );
      // Check if user exists
      const currentUser = await UserModel.findOne({ email: decoded.email });
      if (!currentUser) {
        throw new Error("The user that belongs to this token no longer exists");
      }
      req.user = currentUser;
      next();
    } catch (error) {
      res
        .status(401)
        .json({ status: "fail", message: " You Are not authenticated" });
    }
  }
  ru;
}
export const authMiddleware = new AuthenticationMiddleware();
