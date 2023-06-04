import { Pool } from "pg";
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "testcontainers";
import request from "supertest";
import setupDB from "../../../setupDB";
import createApp from "../../../src/app";
import { Application } from "express";
import bcrypt from "bcrypt";

describe(" POST /register", () => {
  let container: StartedPostgreSqlContainer, db: Pool, app: Application;
  // define an example user
  const user = {
    email: "email@service.com",
    password: "Password@1234",
    firstName: "firstName",
    lastName: "lastName",
  };

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
    // database is currently empty
    const response = await request(app).post("/auth/register").send(user);

    expect(response.status).toBe(200);
    // expect returned object partially match the user object
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
      })
    );
  });

  it("should return 409, email already in use", async () => {
    // there is already a user with that email in the database
    const response = await request(app).post("/auth/register").send(user);

    expect(response.status).toBe(409);

    // disconnect the database and stop the container
    await db.end();
    await container.stop();
  });

  it("should return 500, server error", async () => {
    // connection to database is closed so this should fail
    const response = await request(app).post("/auth/register").send(user);

    expect(response.status).toBe(500);
  });
});

describe("POST /atuh/login", () => {
  let container: StartedPostgreSqlContainer, db: Pool, app: Application;

  // define an example user
  const user = {
    email: "email@service.com",
    password: "Password@1234",
    firstName: "firstName",
    lastName: "lastName",
  };

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

  it("should return 401, incorrect username or password if no user found", async () => {
    // currently the database is empty
    const response = await request(app).post("/auth/login").send(user);

    expect(response.status).toBe(401);
  });

  it(" should return 401, incorrect username or password if passwords do not match", async () => {
    // database still empty
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    // so insert a user in the database
    await db.query(
      "INSERT INTO users(email, password, first_name, last_name) VALUES($1, $2, $3, $4)",
      [user.email, hashedPassword, user.firstName, user.lastName]
    );

    // send a request with a different password
    const response = await request(app)
      .post("/auth/login")
      .send({ email: user.email, password: "wrongPassword" });

    expect(response.status).toBe(401);
  });

  it("it should return the user if passwords match", async () => {
    // a user already exists in the database
    const response = await request(app).post("/auth/login").send(user);

    expect(response.status).toBe(200);
    // expect returned object partially match the user object
    expect(response.body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
      })
    );

    // disconnect the database and stop the container
    await db.end();
    await container.stop();
  });

  it("should return 500 if database call fails", async () => {
    const response = await request(app).post("/auth/login").send(user);

    expect(response.status).toBe(500);
  });
});
