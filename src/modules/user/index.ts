import { UserService } from "./user.service";
import { userRepoType, db } from "./user.repo";
import UserController from "./user.controller";

const userRepository: userRepoType = db;
const userService = new UserService(userRepository);

<<<<<<< HEAD
const userController = new UserController(userService);

userController.initRoutes();


=======
const userController = new UserController(userService, userRepository);

userController.initRoutes();

>>>>>>> f76e9c1a886e3f25bc8a1e0fe3ca23c27f687cac
export { userController as userRoutes };
