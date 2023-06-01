import { PoolClient } from "pg";
import OrderItemModel from "./orderItemModel";

export default class OrdersModel {
  db: PoolClient;
  orderItemModel: OrderItemModel;
  constructor(db: PoolClient) {
    this.db = db;
    this.orderItemModel = new OrderItemModel(db);
  }

  async initializeOrder(userId: string, total: number) {
    const statement =
      "INSERT INTO orders(users_id, total, status) VALUES($1, $2, $3) RETURNING *";
    const result = await this.db.query(statement, [userId, total, "PENDING"]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async addItems(
    orderId: number,
    cartItems: {
      id: number;
      name: string;
      description: string;
      quantity: number;
      price: number;
    }[]
  ) {
    const promiseArrayItems = cartItems.map(async (item) => {
      return await this.orderItemModel.create({ orders_id: orderId, ...item });
    });

    const orderItems = await Promise.all(promiseArrayItems);

    return orderItems;
  }

  async complete(orderId: string) {
    const statement =
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING id, total, created_at";
    const result = await this.db.query(statement, ["COMPLETED", orderId]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async findAllByUserId(userId: string) {
    const statement = "SELECT * FROM orders WHERE users_id = $1";
    const result = await this.db.query(statement, [userId]);

    if (result.rows?.length) {
      return result.rows;
    }

    return [];
  }

  async findByOrderId(orderId: string) {
    const statement = "SELECT * FROM orders WHERE id = $1";
    const result = await this.db.query(statement, [orderId]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }
}
