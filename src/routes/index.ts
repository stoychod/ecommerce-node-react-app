import { Application } from "express";
import { PassportStatic } from "passport";
import { Pool } from "pg";
import authRouter from "./authRouter";
import productRouter from "./productRouter";
import cartRouter from "./cartRouter";

const configureRoutes = (
  app: Application,
  passport: PassportStatic,
  db: Pool
) => {
  authRouter(app, passport, db);
  productRouter(app, db);
  cartRouter(app, db);
};

export default configureRoutes;
