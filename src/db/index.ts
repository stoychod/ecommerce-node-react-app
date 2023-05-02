import { Pool } from "pg";
import { DB } from "../environment";

const pool = new Pool({
  database: DB.PGDATABASE,
  user: DB.PGUSER,
  password: DB.PGPASSWORD,
  host: DB.PGHOST,
  port: DB.PGPORT,
});

const db = {
  query: (statement: string, paramas: string[]) => {
    return pool.query(statement, paramas);
  },
};

export default db;
