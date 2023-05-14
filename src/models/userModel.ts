import { Pool } from "pg";

class UserModel {
  db: Pool;
  constructor(db: Pool) {
    this.db = db;
  }
  async create(userData: string[]) {
    const statement =
      "INSERT INTO users(email, password, first_name, last_name) VALUES($1, $2, $3, $4) RETURNING *";
    const result = await this.db.query(statement, userData);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async findByOneEmail(email: string) {
    const statement = "SELECT * FROM users WHERE email = $1";
    const result = await this.db.query(statement, [email]);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }
}

export default UserModel;
