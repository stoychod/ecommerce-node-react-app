import { Application } from "express";
import { PassportStatic } from "passport";
import { Pool } from "pg";
import authRouter from "./authRouter";
import productRouter from "./productRouter";
import cartRouter from "./cartRouter";
import userRouter from "./userRouter";

const configureRoutes = (
  app: Application,
  passport: PassportStatic,
  db: Pool,
  routePrefix: string
) => {
  authRouter(app, passport, db, routePrefix);
  productRouter(app, db, routePrefix);
  cartRouter(app, db, routePrefix);
  userRouter(app, db, routePrefix);
};

export default configureRoutes;
