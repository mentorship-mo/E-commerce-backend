import { userRoutes } from "../modules/user/index";
import express, { Router } from "express";

const router: Router = express.Router();

router.use("/user", userRoutes.getRouter());

export { router as combinedRoutes };
