import pool from "./pool";

const user = {
  create: async (userData: string[]) => {
    const statement =
      "INSERT INTO users(email, password, first_name, last_name) VALUES($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(statement, userData);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  },

  findByOneEmail: async (email: string) => {
    const statement = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(statement, [email]);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  },
};

export default user;
