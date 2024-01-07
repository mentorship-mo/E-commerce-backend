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
  // getUserById(id: string): Promise<User | null> {
  //   throw new Error("Method not implemented.");
  // }
  // getUsers(): Promise<User[]> {
  //   throw new Error("Method not implemented.");
  // }
  async verifyEmail(verificationToken: string): Promise<any> {
    return await this.model.findOneAndUpdate({ verificationToken }, { verified: true })
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.model.findOne({ email })
  }
  async getUserById(id: string): Promise<User | null> {
    return await this.model.findById(id);
  }
  async enable2FAForUser(email: string): Promise<void> {
    try {
      const user = await this.model.findOneAndUpdate({ email }, { is2FAEnabled: true });
      if (!user) {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error enabling 2FA for user:', error);
      throw error;
    }
  }
}


type userRepoType = userRepo;

const db = new userRepo(UserModel);

export { userRepoType, db };
