import express, { Application } from "express";
import { Pool } from "pg";
import CartService from "../services/cartService";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();

const cartRouter = (app: Application, db: Pool) => {
  const cartService = new CartService(db);

  app.use("/cart", router);

  router.get("/", isAuthenticated, async (req, res) => {
    const userId = req.user?.id;
    console.log(req.user);
    if (userId) {
      const cart = await cartService.loadCart(userId);

      res.status(200).send(cart);
    }
  });

  router.post("/", isAuthenticated, async (req, res) => {
    const userId = req.user?.id;
    if (userId) {
      const newCart = await cartService.createCart(userId);

      res.status(200).send(newCart);
    }
  });

  router.post("/items", isAuthenticated, async (req, res) => {
    const userId = req.user?.id;
    const data = req.body;
    if (userId) {
      const newCart = await cartService.addItem(userId, data);

      res.status(200).send(newCart);
    }
  });
};

export default cartRouter;
