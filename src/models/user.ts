import db from "../db";

const userModel = {
  create: async (userData: string[]) => {
    const statement =
      "INSERT INTO users(email, password, first_name, last_name) VALUES($1, $2, $3, $4) RETURNING *";
    try {
      console.log(userData);
      const result = await db.query(statement, userData);
      if (result.rows?.length) {
        console.log(result.rows[0]);
        return result.rows[0];
      }

      return null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  findByOneEmail: async (email: string) => {
    const statement = "SELECT email FROM users WHERE email = $1";
    try {
      const result = await db.query(statement, [email]);
      if (result.rows?.length) {
        console.log(result.rows[0]);
        return result.rows[0];
      }

      return null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};

export default userModel;
