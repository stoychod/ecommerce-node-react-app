import { Application } from "express";
import configureRoutes from "../routes";
import configureExpress from "./express";

const configureApplication = async (app: Application) => {
  configureExpress(app);

  configureRoutes(app);
};

export default configureApplication;
