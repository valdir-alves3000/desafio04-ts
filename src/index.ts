import express, { Request, Response } from "express";
import { AppDataSource } from "./database";
import { router } from "./routes";

const server = express();
server.use(express.json());
server.use(router);

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

server.get("/", (request: Request, response: Response) => {
  return response.status(200).json({ message: "DioBank API" });
});

server.listen(5000, () => console.log("Server on"));
