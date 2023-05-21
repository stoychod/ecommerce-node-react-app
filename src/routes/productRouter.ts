import express, { Application } from "express";
import { Pool } from "pg";
import ProductService from "src/services/productService";
const router = express.Router();

const productRouter = (app: Application, db: Pool) => {
  const productService = new ProductService(db);

  app.use("/product", router);

  router.get("/:id", async (req, res, next) => {
    try {
      console.log("product route called");
      const productId = req.params.id;
      const product = await productService.getProduct(productId);
      console.log(product);
      res.status(200).send(product);
    } catch (error) {
      next(error);
    }
  });
};

export default productRouter;
