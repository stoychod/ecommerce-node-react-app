import { Pool } from "pg";

export default class ProductModel {
  db: Pool;
  constructor(db: Pool) {
    this.db = db;
  }
  async findOneById(producId: string) {
    const statement = "SELECT * FROM product WHERE id = $1";
    const result = await this.db.query(statement, [producId]);
    // console.log(result.rows[0]);
    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }
}
