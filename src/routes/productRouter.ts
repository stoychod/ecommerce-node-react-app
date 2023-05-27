import express, { Application } from "express";
import { Pool } from "pg";
import ProductService from "../services/productService";

const router = express.Router();

const productRouter = (app: Application, db: Pool) => {
  const productService = new ProductService(db);

  app.use("/products", router);

  router.get("/", async (req, res, next) => {
    try {
      const category =
        typeof req.query.category === "string" ? req.query.category : null;

      const products = await productService.listProducts(category);

      res.status(200).send(products);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await productService.getProduct(productId);
      res.status(200).send(product);
    } catch (error) {
      next(error);
    }
  });
};

export default productRouter;
