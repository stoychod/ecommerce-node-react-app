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

  async find(category: string | null) {
    console.log(category);
    const statement =
      "SELECT * FROM product WHERE (category = $1 OR $1 IS NULL)";
    const result = await this.db.query(statement, [category]);

    return result.rows;
  }
}
