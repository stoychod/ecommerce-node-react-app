import { Pool } from "pg";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "testcontainers";
import request, { SuperAgentTest } from "supertest";
import setupDB from "../../../setupDB";
import createApp from "../../../src/app";
import { Application } from "express";
import AuthService from ".,/../../src/services/authService";
import CartModel from "../../../src/models/cartModel";

describe("cart routes", () => {
  let container: StartedPostgreSqlContainer,
    db: Pool,
    app: Application,
    authService: AuthService,
    cartModel: CartModel,
    user,
    userId: string,
    agent: SuperAgentTest;
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

    const exampleUser = {
      email: "eamil@service.com",
      password: "password",
      firsName: "firsName",
      lastName: "lastName",
    };

    authService = new AuthService(db);
    cartModel = new CartModel(db);

    user = await authService.register(exampleUser);

    agent = request.agent(app);

    const response = await agent
      .post("/auth/login")
      .send({ email: exampleUser.email, password: exampleUser.password });

    userId = response.body.id;

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

    const dbProducts = await Promise.all(productsPromiseArray);
    return dbProducts;
  }, 10000);

  afterAll(async () => {
    db.end();
    container.stop();
  });

  describe("POST /cart", () => {
    it("should create a cart", async () => {
      const response = await agent.post("/cart");
      const userCart = response.body;

      // console.log(userCart);
      expect(userCart).toEqual(
        expect.objectContaining({
          users_id: userId,
        })
      );
    });
  });

  describe("POST /cart/items", () => {
    it("should add an item to the user cart", async () => {
      const item = {
        productId: 1,
        quantity: 1,
      };
      const response = await agent.post("/cart/items").send(item);
      const cartItem = response.body;

      expect(cartItem).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          cart_id: 1,
          product_id: item.productId,
          quantity: item.quantity,
        })
      );
    });
  });

  describe("GET /cart", () => {
    it("should return all items in a user cart", async () => {
      // add another product to the cart
      const item = {
        productId: 2,
        quantity: 2,
      };
      await agent.post("/cart/items").send(item);

      const response = await agent.get("/cart");
      const userCart = response.body;

      // console.log(response.body);
      expect(userCart).toEqual(
        expect.objectContaining({
          id: 1,
          users_id: 1,
          created_at: expect.any(String),
          updated_at: expect.any(String),
          items: expect.arrayContaining([
            {
              cartItemId: 1,
              quantity: 1,
              id: 1,
              name: "T-shirt",
              description:
                "Black, cotton-blend fabric provides all-day comfort.",
              category: "Clothing",
              price: expect.any(String),
            },
            {
              cartItemId: 2,
              quantity: 2,
              id: 2,
              name: "Shorts",
              description: "Casual training shorts for men, light and comfy",
              category: "Clothing",
              price: expect.any(String),
            },
          ]),
        })
      );
    });
  });

  describe("PUT /cart/items/:cartItemId", () => {
    it("should update the cart item with the given id", async () => {
      const data = { quantity: 5 };

      const response = await agent.put("/cart/items/1").send(data);
      const updatedItem = response.body;
      // console.log(response.body);

      expect(updatedItem).toEqual({
        id: 1,
        cart_id: 1,
        product_id: 1,
        quantity: data.quantity,
      });
    });
  });

  describe("DELETE /cart/items/:cartItemId", () => {
    it(" should delete the item with the given id", async () => {
      const response = await agent.delete("/cart/items/2");
      const deletedItem = response.body;
      console.log(deletedItem);

      expect(deletedItem).toEqual({
        id: 2,
        cart_id: 1,
        product_id: 2,
        quantity: 2,
      });
    });
  });
});
