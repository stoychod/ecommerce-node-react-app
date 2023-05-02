import { Application } from "express";
import configureRoutes from "../routes";

const configureApplication = async (app: Application) => {
  configureRoutes(app);
};

export default configureApplication;
