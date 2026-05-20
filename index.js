import express from "express";
import bootstrap from "./src/app.controller.js";

const app = express();
const port = process.env.SERVER_PORT;
const server_url = process.env.SERVER_URL;

await bootstrap(app, express);

app.listen(port, () => {
    console.log(`Server has been run on ${server_url}:${port}`);
})