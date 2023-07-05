import { Pool, PoolClient } from "pg";
import OrdersModel from "../models/ordersModel";
import OrderItemModel from "../models/orderItemModel";
import createHttpError from "http-errors";

export default class OrdersService {
  ordersModel: OrdersModel;
  orderItemModel: OrderItemModel;
  db: Pool | PoolClient;
  constructor(db: Pool | PoolClient) {
    this.ordersModel = new OrdersModel(db);
    this.orderItemModel = new OrderItemModel(db);
    this.db = db;
  }

  async findAll(userId: number) {
    const orders = await this.ordersModel.findAllByUserId(userId);
    return orders;
  }

  async findOne(orderId: string) {
    const order = await this.ordersModel.findByOrderId(orderId);
    if (!order) {
      throw createHttpError(404, "Order does not exist");
    }

    return order;
  }

  async loadOrder(orderId: string) {
    const order = await this.ordersModel.findByOrderId(orderId);
    if (!order) {
      throw createHttpError(404, "Order does not exist");
    }

    const orderItems = await this.orderItemModel.find(orderId);

    return orderItems;
  }
}
