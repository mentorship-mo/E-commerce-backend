import { UserService } from "./user.service";
import { userRepoType, db } from "./user.repo";
import UserController from "./user.controller";

const userRepository: userRepoType = db;
const userService = new UserService(userRepository);

const userController = new UserController(userService);

userController.initRoutes();



export { userController as userRoutes };
