import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { swaggerSpec } from "./utils/swagger/options";
dotenv.config();
import connectToMongoDB from "./config/dbConfig";

import { combinedRoutes } from "./routes/index";
dotenv.config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/v1", combinedRoutes);

// DataBase connection
connectToMongoDB();

const Port: string = process.env.PORT || "4000";
app.listen(Port, () => {
  console.log("Listen");
  console.log(` Server is running  🚀 In Port ${Port} 📭 `);
});
