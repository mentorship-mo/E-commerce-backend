import express, { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import passport from "passport";

import { swaggerSpec } from "./utils/swagger/options";
import configurePassport from "./config/passport-setup";
import connectToMongoDB from "./config/dbConfig";
import { combinedRoutes } from "./routes/index";
import { errorHandlerMiddleWare } from "./middleware/error-handler";
import { NotFoundError } from "./utils/error/not-found-error";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize())
configurePassport(passport)

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/v1", combinedRoutes);

app.all("*", (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandlerMiddleWare);

// DataBase connection
connectToMongoDB();

const Port: string = process.env.PORT || "4000";
app.listen(Port, () => {
  console.log(` Server is running 🚀 In Port ${Port} 📭 `);
});

