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
  async verifyEmail(verificationToken: string): Promise<any> {
    return await this.model.findOneAndUpdate(
      { verificationToken },
      { verified: true }
    );
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return await this.model.findOne({ email });
  }
  async findGoogleId(id: string): Promise<User | null> {
    return await this.model.findOne({ googleID: id });
  }
  async getUserById(id: string): Promise<User | null> {
    return await this.model.findById(id);
  }
  async updateNameByEmail(email: string, name: string) {
    const user = await this.model.updateOne({ email }, { name }, { new: true });
    return user;
  }
}

type userRepoType = userRepo;

const db = new userRepo(UserModel);

export { userRepoType, db };
