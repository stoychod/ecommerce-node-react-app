import { Client, PoolClient } from "pg";

export default class OrderItemModel {
  db: PoolClient;
  constructor(db: PoolClient) {
    this.db = db;
  }

  async create(item: {
    orders_id: number;
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
  }) {
    const { orders_id, id:product_id, name, description, quantity, price } = item;
    const statement =
      "INSERT INTO order_items(orders_id, product_id, name, description, quantity, price) VALUES($1, $2, $3, $4, $5, $6) RETURNING *";
    const result = await this.db.query(statement, [
      orders_id,
      product_id,
      name,
      description,
      quantity,
      price,
    ]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async find(orderId: string) {
    const statement = "SELECT * FROM order_items WHERE orders_id = $1";
    const result = await this.db.query(statement, [orderId]);

    if (result.rows?.length) {
      return result.rows;
    }

    return [];
  }
}
