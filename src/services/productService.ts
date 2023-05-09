import db from "../db";
import createHttpError from "http-errors";

const productService = {
  getProduct: async (id: number) => {
    try {
      const product = db.product.getById(id);
      if (!product) {
        throw createHttpError(401, "Product not found");
      }

      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(500, error);
      }
    }
  },
};

export default productService;
