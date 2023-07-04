import { Pool, PoolClient } from "pg";
import OrdersModel from "../models/ordersModel";

export default class OrdersService {
  ordersModel: OrdersModel;
  db: Pool | PoolClient;
  constructor(db: Pool | PoolClient) {
    this.ordersModel = new OrdersModel(db);
    this.db = db;
  }

  async findAll(userId: number) {
    const orders = await this.ordersModel.findAllByUserId(userId);
    return orders;
  }
}
