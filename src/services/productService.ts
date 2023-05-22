import { Pool } from "pg";
import ProductModel from "../models/productModel";
import createHttpError from "http-errors";

export default class ProductService {
  productModel: ProductModel;
  constructor(db: Pool) {
    this.productModel = new ProductModel(db);
  }

  async getProduct(id: string) {
    try {
      const product = await this.productModel.findOneById(id);
      if (!product) {
        throw createHttpError(404, "Product not found");
      }

      return product;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(500, error);
      }
    }
  }

  async listProducts(category: string | null) {
    try {
      const products = await this.productModel.find(category);

      return products;
    } catch (error) {
      if (error instanceof Error) {
        throw createHttpError(500, error);
      }
    }
  }
}
