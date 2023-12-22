import { userRepoType } from "./user.repo";
import bcrypt from 'bcrypt';

export class UserService {
  private readonly repo: userRepoType;

  constructor(repo: userRepoType) {
    this.repo = repo;
  }

  // getAllUsers(): Promise<void> {}

  createUser(userData: any): Promise<void> {
    try {  
      return this.repo.createUser(userData);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
  }
}

async authenticateUser(email: string, password: string): Promise<boolean> {
  try {
    const user = await this.repo.getUserByEmail(email);

    if (!user) {
      // user not found with the provided email
      return false;
    }

    // check if passwords match 
    const passwordsMatch = await bcrypt.compare(password, user.password);

    return passwordsMatch;
  } catch (error) {
    console.error("Error authenticating user:", error);
    throw error;
  }
}
}
