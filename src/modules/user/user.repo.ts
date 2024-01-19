import { userDAO } from "../../utils/DAO/user-dao";
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
  async verifyEmail(userId: string): Promise<any> {
    return this.model.findOneAndUpdate({ _id: userId }, { verified: true });
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return this.model.findOne({ email });
  }
  async findGoogleId(id: string): Promise<User | null> {
    return this.model.findOne({ googleID: id });
  }
  async getUserById(id: string): Promise<User | null> {
    return this.model.findById(id);
  }
  updateUserAddresses = async (id: string, addresses: any): Promise<any> => {
    return this.model.findOneAndUpdate({ _id: id }, { $set: { addresses } } , {new : true})
  };
  async updateNameByEmail(email: string, name: string) {
    const user = await this.model.findOneAndUpdate(
      { email },
      { $set: { name } },
      { new: true }
    );

    return user;
  }
  updateUserEmail(user: User): Promise<User | null> {
    return this.model
      .findByIdAndUpdate(user.id, {
        email: user.email,
        verificationToken: user.verificationToken,
      })
      .lean();
  }

  async findById(userId: string): Promise<User | null> {
    return await this.model.findById(userId);
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    // Update the user's password
    await this.model.findByIdAndUpdate(userId, { password: hashedPassword });
  }

  async verify2FA(userId: string): Promise<any> {
    return this.model.findOneAndUpdate({ _id: userId }, { is2FAEnabled: true });
  }
}

type userRepoType = userRepo;
const db = new userRepo(UserModel);

export { userRepoType, db };
