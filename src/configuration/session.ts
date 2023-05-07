import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { SESSION_SECRET } from "../environment";
import { Application } from "express";
import { Pool } from "pg";

const configureSession = (app: Application, pool: Pool) => {
  const pgSession = connectPgSimple(session);

  app.use(
    session({
      store: new pgSession({
        pool: pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      }),
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );
};

export default configureSession;
