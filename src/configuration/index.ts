import { Application } from "express";
import { Pool } from "pg";
import configureExpress from "./express";
import configureSession from "./session";
import configurePassport from "./passport";
import configureRoutes from "../routes";
import configureSwagger from "./swagger";
import configureError from "../middleware/error";

const configureApplication = (app: Application, db: Pool) => {
  configureExpress(app);

  configureSession(app, db);

  const passport = configurePassport(app, db);

  configureRoutes(app, passport, db);

  configureSwagger(app);

  configureError(app);
};

export default configureApplication;
