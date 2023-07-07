import express from "express";
import path from "path";
import configureApplication from "./configuration";
import { Pool } from "pg";

const createApp = (db: Pool, routePrefix: string) => {
  const app = express();

  configureApplication(app, db, routePrefix);

  // if no route is matched on the server send the rquest to react
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "..", "static", "index.html"));
  });

  return app;
};

export default createApp;
