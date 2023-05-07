import { PORT } from "./environment";
import express from "express";
import configureApplication from "./configuration";
import db from "./db";

const app = express();
const port = PORT || 3000;

configureApplication(app, db.pool);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
