import { Pool } from "pg";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "testcontainers";
import request from "supertest";
import setupDB from "../../../setupDB";
import createApp from "../../../src/app";
import { Application } from "express";

describe("GET /products", () => {
  let container: StartedPostgreSqlContainer,
    db: Pool,
    app: Application,
    dbProducts: {
      id: number;
      name: string;
      description: string;
      category: string;
      price: number;
    }[];
  beforeAll(async () => {
    // initialize test container
    container = await new PostgreSqlContainer().start();

    // initialize database connection
    db = new Pool({
      host: container.getHost(),
      port: container.getPort(),
      database: container.getDatabase(),
      user: container.getUsername(),
      password: container.getPassword(),
    });

    // initialize database
    await setupDB(db);

    // initialize application
    app = createApp(db);

    const products = [
      {
        name: "T-shirt",
        description: "Black, cotton-blend fabric provides all-day comfort.",
        category: "Clothing",
        price: 15,
      },
      {
        name: "Shorts",
        description: "Casual training shorts for men, light and comfy",
        category: "Clothing",
        price: 8,
      },
      {
        name: "Trainers",
        description: "Mens Mesh Running Trainers",
        category: "Shoes",
        price: 30,
      },
    ];

    const productsPromiseArray = products.map(async (product) => {
      const result = await db.query(
        "INSERT INTO product(name, description, category, price) VALUES($1, $2, $3, $4) RETURNING *",
        [product.name, product.description, product.category, product.price]
      );
      return result.rows[0];
    });

    dbProducts = await Promise.all(productsPromiseArray);
    return dbProducts;
  }, 10000);

  it("should return all products", async () => {
    const response = await request(app).get("/products");
    // console.dir(dbProducts);

    // console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining(dbProducts));
  });

  it("should return only products mathcing given category", async () => {
    const response = await request(app).get("/products?category=Clothing");

    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
    // expect an array containing only products in Clothing category
    expect(response.body).toEqual(
      expect.arrayContaining(
        dbProducts.filter((product) => {
          return product.category === "Clothing";
        })
      )
    );
  });

  it("should return an empty array if there is no product with the given category", async () => {
    const response = await request(app).get("/products?category=Electronics");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);

    // disconnect the database and stop the container
    await db.end();
    await container.stop();
  });

  it("should return 500 error if database call falis", async () => {
    // database is disconnected now so this call should fail
    const response = await request(app).get("/products");

    expect(response.status).toBe(500);
  });
});

