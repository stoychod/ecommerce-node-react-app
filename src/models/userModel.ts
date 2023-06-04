import { Pool } from "pg";
import bcrypt from "bcrypt";

export default class UserModel {
  db: Pool;
  constructor(db: Pool) {
    this.db = db;
  }
  async create(userData: string[]) {
    const statement = `INSERT INTO users(email, password, first_name, last_name)
                       VALUES($1, $2, $3, $4)
                       RETURNING id, email, first_name, last_name`;
    const result = await this.db.query(statement, userData);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async update(userData: {
    id: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
  }) {
    console.log(userData);

    const { id, email, firstName, lastName } = userData;

    // if password is being changed hash it before saving to database
    let password = userData.password;
    if (password) {
      const saltRounds = 10;
      password = await bcrypt.hash(password, saltRounds);
    }

    const statement = `UPDATE users
                       SET email = COALESCE($2, email),
                           password = COALESCE($3, password),
                           first_name = COALESCE($4, first_name),
                           last_name = COALESCE($5, last_name)
                       WHERE id = $1
                       RETURNING *`;

    const result = await this.db.query(statement, [
      id,
      email,
      password,
      firstName,
      lastName,
    ]);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async findOneByEmail(email: string) {
    const statement = `SELECT id, email, first_name, last_name, password
                       FROM users WHERE email = $1`;
    const result = await this.db.query(statement, [email]);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async findOneById(userId: string) {
    const statement = `SELECT id, email, first_name, last_name
                       FROM users WHERE id = $1`;
    const result = await this.db.query(statement, [userId]);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }
}
