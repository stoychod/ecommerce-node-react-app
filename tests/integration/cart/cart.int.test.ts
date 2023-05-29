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

    const product = {
      name: "T-shirt",
      description: "Black, cotton-blend fabric provides all-day comfort.",
      category: "Clothing",
      price: 15,
    };

    //insert a product in the database
    const result = await db.query(
      "INSERT INTO product(name, description, category, price) VALUES($1, $2, $3, $4) RETURNING *",
      [product.name, product.description, product.category, product.price]
    );

    // check if the product has been successfully added to the database
    if (!result.rows?.length) {
      // if so proceed with the test
      throw Error("Failed to insert aproduct into database in bdforeAll!");
    }

    authService = new AuthService(db);
    cartModel = new CartModel(db);

    user = await authService.register(exampleUser);

    agent = request.agent(app);

    const response = await agent
      .post("/auth/login")
      .send({ email: exampleUser.email, password: exampleUser.password });

    userId = response.body.id;
  }, 10000);

  afterAll(async () => {
    db.end();
    container.stop();
  });

  describe("POST /cart", () => {
    it("should create a cart", async () => {
      const response = await agent.post("/cart");
      const userCart = response.body;

      console.log(userCart);
      expect(userCart).toEqual(
        expect.objectContaining({
          users_id: userId,
        })
      );
    });
  });
});
