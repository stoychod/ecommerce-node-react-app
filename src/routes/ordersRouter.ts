import express, { Application } from "express";
import { Pool } from "pg";
import isAuthenticated from "../middleware/isAuthenticated";
import OrdersService from "../services/ordersService";

const router = express.Router();

const ordersRouter = (app: Application, db: Pool, routePrefix: string) => {
  const ordersService = new OrdersService(db);

  app.use(`${routePrefix}/orders`, router);

  router.get("/", isAuthenticated, async (req, res) => {
    const userId = req.user?.id;
    console.log(req.user);
    if (userId) {
      const orders = await ordersService.findAll(userId);

      res.status(200).send(orders);
    }
  });

  router.get("/:orderId", isAuthenticated, async (req, res) => {
    const orderId = req.params.orderId;

    const order = await ordersService.findOne(orderId);

    res.status(200).send(order);
  });

  router.get("/:orderId/items", isAuthenticated, async (req, res) => {
    const orderId = req.params.orderId;

    const orderItems = await ordersService.loadOrder(orderId);

    res.status(200).send(orderItems);
  });
};

export default ordersRouter;
