import express, { Request, Response } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { swaggerSpec } from "./utils/swagger/options";
dotenv.config();
import connectToMongoDB from "./config/dbConfig";

import { combinedRoutes } from "./routes/index";
import { errorHandlerMiddleWare } from "./middleware/error-handler";
import { NotFoundError } from "./utils/error/not-found-error";

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/v1", combinedRoutes);

// Add catch-all route for unhandled routes
app.all("*", (req: Request, res: Response) => {
  // Assuming NotFoundError is properly thrown in your routes
  throw new NotFoundError();
});

app.use(errorHandlerMiddleWare);

// DataBase connection
connectToMongoDB();

const Port: string = process.env.PORT || "4000";
app.listen(Port, () => {
  console.log(` Server is running 🚀 In Port ${Port} 📭 `);
});
