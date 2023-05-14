import { Pool } from "pg";
import { DB } from "../environment";

const db = new Pool({
  database: DB.PGDATABASE,
  user: DB.PGUSER,
  password: DB.PGPASSWORD,
  host: DB.PGHOST,
  port: DB.PGPORT,
});

export default db;
