import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import postsRoute from "./routes/posts_route";
import authController from "./routes/auth_route";
import commentsRoute from "./routes/comments_route";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

const externalServerApi = process.env.EXTERNAL_SERVER_API;
const externalServerPort = process.env.EXTERNAL_SERVER_PORT;

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Database"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use("/posts", postsRoute);
app.use("/auth", authController);
app.use("/comments", commentsRoute);

app.use('/api/public', express.static(path.join(__dirname, 'blob-images')));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food By Me - REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: `https://${externalServerApi}:${externalServerPort}`, },],
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

export const initApp = () => {
  return new Promise<Express>(async (resolve, reject) => {
    if (process.env.DB_CONNECTION == undefined) {
      reject("DB_CONNECTION is not defined");
    } else {
      await mongoose.connect(process.env.DB_CONNECTION);
      resolve(app);
    }
  });
};

export default initApp;