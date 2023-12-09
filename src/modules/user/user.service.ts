import {userRepoType, db} from './user.repo'; 
// import { User } from './user.model'; 

class UserService {
    private userRepository: userRepoType;

    constructor(userRepository: userRepoType) {
        this.userRepository = userRepository;
    }

    async getAllUsers(): Promise<void> {
      
    }

    async createUser(): Promise<void> {
  
    }
}

export default UserService;
