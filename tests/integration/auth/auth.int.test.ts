import { Pool } from "pg";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "testcontainers";
import request from "supertest";
import setupDB from "../../../setupDB";
import createApp from "../../../src/app";
import { Application } from "express";

describe(" POST /register", () => {
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

  it("should save the user to the databse and return it", async () => {
    const user = {
      email: "email@service.com",
      password: "password",
      firstName: "firstName",
      lastName: "lastName",
    };

    const response = await request(app).post("/auth/register").send(user);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: user.email,
        password: expect.stringContaining("$2b$10$"),
        first_name: user.firstName,
        last_name: user.lastName,
        created_at: expect.any(String),
        updated_at: expect.any(String),
      })
    );
  });

  it("should return 409, email already in use", async () => {
    const user = {
      email: "email@service.com",
      password: "password",
      firstName: "firstName",
      lastName: "lastName",
    };

    const response = await request(app).post("/auth/register").send(user);
    console.log(response);

    expect(response.status).toBe(409);

    await db.end();
    await container.stop();
  });

  it("should return 500, server error", async () => {
    const user = {
      email: "email@service.com",
      password: "password",
      firstName: "firstName",
      lastName: "lastName",
    };
    const response = await request(app).post("/auth/register").send(user);
    console.log(response);

    expect(response.status).toBe(500);
  });
});
