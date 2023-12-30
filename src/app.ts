import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./utils/swagger/options"
dotenv.config();

import { combinedRoutes } from "./routes/index";
import connectToMongoDB from "./config/dbConfig";

const app = express();
app.use(express.json());


app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/v1", combinedRoutes);

// DataBase connection
connectToMongoDB();

const Port: string | number = process.env.PORT || 4000;
app.listen(Port, () => {
  console.log(
    ` Server is running  🚀
 In Port ${Port} 📭 `
  );
});

