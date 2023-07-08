import { Pool } from "pg";
import { DB, DATABASE_URL } from "../environment";

// const db = new Pool({
//   database: DB.PGDATABASE,
//   user: DB.PGUSER,
//   password: DB.PGPASSWORD,
//   host: DB.PGHOST,
//   port: DB.PGPORT,
// });

const db = new Pool({
  connectionString: DATABASE_URL,
});

export default db;
