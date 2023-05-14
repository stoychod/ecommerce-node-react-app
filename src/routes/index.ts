import { Application } from "express";
import authRouter from "./authRouter";
import { PassportStatic } from "passport";
import { Pool } from "pg";

const configureRoutes = (
  app: Application,
  passport: PassportStatic,
  db: Pool
) => {
  authRouter(app, passport, db);
};

export default configureRoutes;
