import dotenv from "dotenv";
import connectDB from "./DB/connection.js";
import { notesRouter, usersRouter } from "./Modules/index.js";

dotenv.config({path: "./src/Config/dev.env"});

const bootstrap = async (app, express) => {
    app.use(express.json());

    await connectDB();

    app.use("/api/v1/notes", notesRouter);
    app.use("/api/v1/users", usersRouter);

    app.get("/", (req, res) => {
        return res.status(200).json({message: "welcome"})
    })

    app.all("/*dummy", (req, res) => {
        return res.status(404).json({message: "Not found handler!!!"});
    })
}

export default bootstrap;