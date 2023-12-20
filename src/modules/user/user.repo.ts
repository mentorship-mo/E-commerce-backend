import { userDAO } from "../../utils/DAO/userDAO";
import { User } from "../../utils/types";
import { Model } from "mongoose";
import { UserModel } from "./user.model";

class userRepo implements userDAO {
  private model: Model<User>;

  constructor(model: Model<User>) {
    this.model = model;
  }
  async createUser(user: User): Promise<void> {
    await this.model.create(user);
  }
  // getUserByEmail(email: string): Promise<User | null> {
  //   throw new Error("Method not implemented.");
  // }
  // getUserById(id: string): Promise<User | null> {
  //   throw new Error("Method not implemented.");
  // }
  // getUsers(): Promise<User[]> {
  //   throw new Error("Method not implemented.");
  // }
}

type userRepoType = userRepo;

const db = new userRepo(UserModel);

export { userRepoType, db };
