import express from "express";
import configureApplication from "./configuration";
import { Pool } from "pg";

const createApp = (db: Pool) => {
  const app = express();

  configureApplication(app, db);
  return app;
};

export default createApp;
