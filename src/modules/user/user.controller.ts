import express, { Request, Response } from "express";
import { UserService } from "./user.service";
import { userDAO } from "../../utils/DAO/userDAO.js";


class UserController {
  private router = express.Router();

  private readonly service: UserService;

  constructor(service){
    this.service = service;
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user: userDAO  = (req.body);
      await this.service.createUser(user);

      res.status(201).send({ message: "User created successfully" });
    } catch (err) {
      res.status(500).send("Internal Server Error");
    }
  }




  initRoutes() {
    this.router.post("/",this.createUser);
  }
  getRouter(){
    return this.router;
  }
}

export default UserController;
