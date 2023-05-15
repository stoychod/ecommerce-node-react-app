import { Pool } from "pg";

export default class ProductModel {
  db: Pool;
  constructor(db: Pool) {
    this.db = db;
  }
  async getById(producId: number) {
    const statement = "SELECT * FROM product WHERE id = $1";
    const result = await this.db.query(statement, [producId]);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }
}
