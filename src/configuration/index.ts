import { Application } from "express";
import configureRoutes from "../routes";
import configureExpress from "./express";
import configureSession from "./session";
import configurePassport from "./passport";
import { Pool } from "pg";
import errorMiddleware from "../middleware/error";

const configureApplication = (app: Application, db: Pool) => {
  configureExpress(app);

  configureSession(app, db);

  const passport = configurePassport(app, db);

  configureRoutes(app, passport, db);

  app.use(errorMiddleware);
};

export default configureApplication;
