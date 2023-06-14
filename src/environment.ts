import * as dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;

export const DB = {
  PGDATABASE: process.env.PGDATABASE,
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGHOST: process.env.PGHOST,
  PGPORT: parseInt(process.env.PGPORT || ""),
};

export const SESSION_SECRET = process.env.SESSION_SECRET || "";

export const ROUTE_PREFIX = process.env.ROUTE_PREFIX || "";
