import express from "express";
import bootstrap from "./src/app.controller.js";
import { SERVER_PORT, SERVER_URL } from "./src/Config/config.service.js";

const app = express();


await bootstrap(app, express);

app.listen(SERVER_PORT, () => {
    console.log(`Server has been run on ${SERVER_URL}:${SERVER_PORT}`);
})