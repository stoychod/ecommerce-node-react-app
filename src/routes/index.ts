import { Application } from "express";
import authRouter from "./authRouter";
import { PassportStatic } from "passport";

const configureRoutes = (app: Application, passport: PassportStatic) => {
  authRouter(app, passport);
};

export default configureRoutes;
