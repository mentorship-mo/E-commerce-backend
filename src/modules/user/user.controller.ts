import express, { RequestHandler } from "express";
import { UserService } from "./user.service";
import { User } from "../../utils/types";


class UserController {
  private router = express.Router();

  private readonly service: UserService;

  constructor(service) {
    this.service = service;
  }
  authSignIn : RequestHandler = async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;

      // assuming UserService has a method for authentication
      const isAuthenticated = await this.service.authenticateUser(email, password);

      if (isAuthenticated) {
        res.status(200).send({ message: "user authenticated successfully" });
      } else {
        res.status(401).send({ message: "Invalid email or password" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
  createUser : RequestHandler = async (req, res): Promise<void> => {
    try {
      const user: User = (req.body);
      await this.service.createUser(user);
      res.status(201).send({ message: "User created successfully" });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  }
  verifyEmail : RequestHandler = async (req, res , next) : Promise<void> => {
    try {
      const  verificationToken  = req.params.token
      await this.service.verifyEmail(verificationToken)
      res.status(201).json({ message: "Email verified successfully" })
    } catch (error) {
      console.log(error);
      res.status(500).json("Internal Server Error");
    }
  }
  ResendVerificationEmail : RequestHandler = async (req,res,next)=>{
    try{
        const email = req.body.email
        await this.service.ResendVerificationEmail(email)
        res.status(200).json({msg : "email resend successfully" })
    }catch(error){
      res.status(500).json("Internal Server Error");
    }
}



initRoutes() {
  this.router.post("/", this.createUser);
  this.router.post("/signin", this.authSignIn);
  this.router.get("/verify-email/:token", this.verifyEmail);
  this.router.get("/Resend-verify-email", this.ResendVerificationEmail);
}
getRouter(){
  return this.router;
}
}

export default UserController;
