import { userRepoType } from "./user.repo";

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
}
