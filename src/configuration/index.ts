import { Application } from "express";
import configureRoutes from "../routes";
import configureExpress from "./express";
import configureSession from "./session";
import { Pool, QueryResult } from "pg";

const configureApplication = async (
  app: Application,
  db: { pool: Pool; query: (statement: string, params: string[]) => Promise<QueryResult<object>> }
) => {
  configureExpress(app);

  configureSession(app, db);

  configureRoutes(app);
};

export default configureApplication;
