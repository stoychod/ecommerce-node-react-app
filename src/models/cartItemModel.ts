import { Pool } from "pg";

export default class CartItemModel {
  db: Pool;
  constructor(db: Pool) {
    this.db = db;
  }

  async create(item: { cartId: string; productId: string; quantity: number }) {
    const {cartId, productId, quantity} = item;
    const statement =
      "ISNERT INTO cart_items(cart_id, product_id, quantity) VALAUES $1, $2, $3 RETURNING *";
    const result = await this.db.query(statement, [
      cartId,
      productId,
      quantity,
    ]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async update(cartItemId: string, quantity: number) {
    const statement =
      "UPDATE cart_items SET quantity = $1 WHERE id = $2 RETURNING *";
    const result = await this.db.query(statement, [quantity, cartItemId]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async find(cartId: string) {
    // Generate SQL statement
    const statement = `SELECT cart_items.id AS "cartItemId", cart_items.quantity, product.*
                         FROM cart_items
                         INNER JOIN product ON product.id = cart_items.product_id
                         WHERE cart_id = $1`;

    const result = await this.db.query(statement, [cartId]);

    if (result.rows?.length) {
      return result.rows;
    }

    return [];
  }

  async delete(cartItemId: string) {
    const statement = "DELETE FORM cart_items WHERE id = $1 RETURNING *";
    const result = await this.db.query(statement, [cartItemId]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }
}
