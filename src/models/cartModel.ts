import { Pool, PoolClient } from "pg";

export default class CartModel {
  db: Pool | PoolClient;
  constructor(db: Pool | PoolClient) {
    this.db = db;
  }

  async create(userId: number) {
    const statement = "INSERT INTO cart(users_id) VALUES($1) RETURNING *";
    const result = await this.db.query(statement, [userId]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async findOneByUserId(userId: number) {
    const statement = "SELECT * FROM cart WHERE users_id = $1";
    const result = await this.db.query(statement, [userId]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async findOneById(cartId: string) {
    const statement = "SELECT * FROM cart WHERE id = $1";
    const result = await this.db.query(statement, [cartId]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }
}
