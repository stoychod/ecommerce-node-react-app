import { Application } from "express";
import configureRoutes from "../routes";
import configureExpress from "./express";
import configureSession from "./session";
import configurePassport from "./passport";
import { Pool } from "pg";

const configureApplication = async (app: Application, pool: Pool) => {
  configureExpress(app);

  configureSession(app, pool);

  const passport = configurePassport(app);

  configureRoutes(app, passport);
};

export default configureApplication;
