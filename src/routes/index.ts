import { Application } from "express";
import authRouter from "./auth";

const configureRoutes = (app: Application) => {
  authRouter(app);
};

export default configureRoutes;
