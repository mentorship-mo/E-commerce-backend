import express, { Request, Response } from "express";
import { UserService } from "./../modules/user/user.service";


class SignIn {
    private router = express.Router();
  
    private readonly service: UserService;
  
    constructor(service: UserService){
      this.service = service;
      this.initRoutes();
    }
  
    authSignIn = async (req: Request, res: Response): Promise<void> => {
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

    private initRoutes() {
        this.router.post("/", this.authSignIn);
    }

    public getRouter(){
        return this.router;
    }
}

export default SignIn;
