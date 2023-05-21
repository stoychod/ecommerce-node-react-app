import ProductService from "../../../src/services/productService";
import ProductModel from "../../../src/models/productModel";
import db from "../../../src/db";
import createHttpError from "http-errors";

// const mockedDB = jest.mocked(db);
// const mockGetById = jest.fn().mockResolvedValue("test");
// jest.mock("../../../src/models/productModel", () => {
//   return jest.fn().mockImplementation(() => {
//     return { getById: mockGetById };
//   });
// });

jest.mock("../../../src/models/productModel");

describe("getProdct", () => {
  it("should return a product given an id", async () => {
    const mockedProduct = {
      id: 1,
      name: "shirt",
      description: "blue",
      price: "£10",
    };

    (ProductModel as jest.Mock).mockImplementation(() => {
      return {
        getById: jest.fn().mockResolvedValue(mockedProduct),
      };
    });

    const productService = new ProductService(db);
    const product = await productService.getProduct("1");

    expect(product).toEqual(mockedProduct);
  });

  it("should thorw 401 if product not in database", async () => {
    (ProductModel as jest.Mock).mockImplementation(() => {
      return {
        getById: jest.fn().mockResolvedValue(null),
      };
    });

    // expect.assertions(1);
    try {
      const productService = new ProductService(db);
      await productService.getProduct("1");
    } catch (error) {
      expect(error).toEqual(createHttpError(401, "Product not found"));
    }
  });

  it("should throw 500 error if database call fails", async () => {
    (ProductModel as jest.Mock).mockImplementation(() => {
      return {
        getById: jest.fn().mockImplementation(() => {
          throw createHttpError(500, "Server error");
        }),
      };
    });

    try {
      const productService = new ProductService(db);
      await productService.getProduct("1");
    } catch (error) {
      expect(error).toEqual(createHttpError(500, "Server error"));
    }
  });
});
