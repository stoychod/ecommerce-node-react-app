import { Pool } from "pg";
import ProductModel from "../models/productModel";
import createHttpError from "http-errors";

class ProductService {
  productModel: ProductModel;
  constructor(db: Pool) {
    this.productModel = new ProductModel(db);
  }

  async getProduct(id: number) {
    try {
      const product = await this.productModel.getById(id);
      if (!product) {
        throw createHttpError(401, "Product not found");
      }

      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(500, error);
      }
    }
  }
}

export default ProductService;
