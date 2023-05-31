import { Client } from "pg";
import OrderItemModel from "./orderItemModel";

export default class OrdersModel {
  db: Client;
  orderItemModel: OrderItemModel;
  constructor(db: Client) {
    this.db = db;
    this.orderItemModel = new OrderItemModel(db);
  }

  async initializeOrder(userId: string, total: number) {
    const statement =
      "ISNERT INTO orders(users_id, toal, status) VALUES($1, $2. $3) RETURNIG *";
    const result = await this.db.query(statement, [userId, total, "PENDING"]);

    if (result.rows?.length) {
      return result.rows[0];
    }

    return null;
  }

  async addItems(
    cartItems: {
      orders_id: number;
      product_id: number;
      name: string;
      description: string;
      quantity: number;
      price: number;
    }[]
  ) {
    const promiseArrayItems = cartItems.map(async (item) => {
      return await this.orderItemModel.create(item);
    });

    const orderItems = await Promise.all(promiseArrayItems);

    return orderItems;
  }

  async complete() {
    const statement = "INSERT INTO orders(status) VALUES($1)";
    const result = await this.db.query(statement, ["COMPLETED"]);

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
