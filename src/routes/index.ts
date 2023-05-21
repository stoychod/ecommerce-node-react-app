import { Application } from "express";
import authRouter from "./authRouter";
import { PassportStatic } from "passport";
import { Pool } from "pg";
import productRouter from "./productRoute";

const configureRoutes = (
  app: Application,
  passport: PassportStatic,
  db: Pool
) => {
  authRouter(app, passport, db);
  productRouter(app,db);
};

export default configureRoutes;
