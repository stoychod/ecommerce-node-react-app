import { Application } from "express";
import configureRoutes from "../routes";
import configureExpress from "./express";
import configureSession from "./session";
import { Pool } from "pg";

const configureApplication = async (app: Application, pool: Pool) => {
  configureExpress(app);

  configureSession(app, pool);

  configureRoutes(app);
};

export default configureApplication;
