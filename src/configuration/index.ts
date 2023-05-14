import { Application } from "express";
import configureRoutes from "../routes";
import configureExpress from "./express";
import configureSession from "./session";
import configurePassport from "./passport";
import { Pool } from "pg";

const configureApplication = (app: Application, db: Pool) => {
  configureExpress(app);

  configureSession(app, db);

  const passport = configurePassport(app, db);

  configureRoutes(app, passport, db);
};

export default configureApplication;
