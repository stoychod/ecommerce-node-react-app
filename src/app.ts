import express from "express";
import configureApplication from "./configuration";
import { Pool } from "pg";

const createApp = (db: Pool, routePrefix: string) => {
  const app = express();

  configureApplication(app, db, routePrefix);
  return app;
};

export default createApp;
