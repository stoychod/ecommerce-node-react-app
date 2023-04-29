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
