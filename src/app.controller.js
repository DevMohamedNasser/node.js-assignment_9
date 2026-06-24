import cors from "cors";
import connectDB from "./DB/connection.js";
import { authRouter, notesRouter, usersRouter } from "./Modules/index.js";
import {
  GlobalErrorHandler,
  NotFoundException,
} from "./Utils/Responses/error.response.js";

const bootstrap = async (app, express) => {
  app.use(express.json(), cors());

  await connectDB();
  

  app.use("/api/v1/notes", notesRouter);
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/auth", authRouter);

  app.get("/", (req, res) => {
    return res.status(200).json({ message: "welcome" });
  });

  app.all("/*dummy", (req, res) => {
    NotFoundException("Not found handler");
  });

  app.use(GlobalErrorHandler);
};

export default bootstrap;
