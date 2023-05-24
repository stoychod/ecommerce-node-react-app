import { Pool } from "pg";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "testcontainers";
import request from "supertest";
import setupDB from "../../../setupDB";
import createApp from "../../../src/app";
import { Application } from "express";


describe("GET /products/:id", () => {
  let container: StartedPostgreSqlContainer, db: Pool, app: Application;
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
  }, 10000);

  it("should return 404, product not found if product not in database", async () => {
    // database is currently empty
    const response = await request(app).get("/products/1");

    expect(response.status).toBe(404);
  });

  it("should return a product given an id", async () => {
    // database still empty
    const product = {
      name: "T-shirt",
      description: "Black, cotton-blend fabric provides all-day comfort.",
      category: "Clothing",
      price: 15,
    };

    // so insert a product in the database
    const result = await db.query(
      "INSERT INTO product(name, description, category, price) VALUES($1, $2, $3, $4) RETURNING *",
      [product.name, product.description, product.category, product.price]
    );

    // check if the product has been successfully added to the database
    if (result.rows?.length) {
      // if so proceed with the test
      const dbPproduct = result.rows[0];

      const response = await request(app).get(`/products/${dbPproduct.id}`);
      // console.log(response.body);

      expect(response.status).toBe(200);
      // expect returned object partially match the product object
      expect(response.body).toEqual(
        expect.objectContaining({
          id: dbPproduct.id,
          name: dbPproduct.name,
          description: dbPproduct.description,
          category: dbPproduct.category,
          price: dbPproduct.price,
        })
      );
    } else {
      console.log(
        "Something has gone wrong, product has not been added to database!"
      );
    }

    // disconnect the database and stop the container
    await db.end();
    await container.stop();
  });

  it("should return 500 error if database call falis", async () => {
    // database is disconnected now so this call should fail
    const response = await request(app).get("/products/1");

    expect(response.status).toBe(500);
  });
});
