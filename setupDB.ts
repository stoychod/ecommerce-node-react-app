import { Pool } from "pg";
import db from './src/db'

const createUsersTable = `
CREATE TABLE IF NOT EXISTS
  users (
    id serial PRIMARY KEY,
    email varchar(255) UNIQUE NOT NULL,
    password varchar(100) NOT NULL,
    first_name varchar(50) NOT NULL,
    last_name varchar(50) NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

const createProuductTable = `
CREATE TABLE IF NOT EXISTS
  product (
    id serial PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    category varchar(50),
    price integer NOT NULL
    image varchar(255) NOT NULL
  );
  `;
const createCartTable = `
CREATE  TABLE IF NOT EXISTS
  cart (
    id serial PRIMARY KEY,
    users_id integer UNIQUE NOT NULL,
    payment_id varchar(100),
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE
  );
`;

const createCartItemsTable = `
CREATE  TABLE IF NOT EXISTS
  cart_items (
    id serial PRIMARY KEY,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart (id),
    FOREIGN KEY (product_id) REFERENCES product (id)
  );
`;

const createOrdersTable = `
CREATE  TABLE IF NOT EXISTS
  orders (
    id serial PRIMARY KEY,
    users_id integer NOT NULL,
    total integer NOT NULL,
    status varchar(50),
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (users_id) REFERENCES users (id)
  );
`;

const createOrderItemsTable = `
CREATE  TABLE IF NOT EXISTS
  order_items (
    id serial PRIMARY KEY,
    orders_id integer NOT NULL,
    product_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    quantity integer NOT NULL,
    price integer NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orders_id) REFERENCES orders (id)
  );
`;

const createTimestampFunc = `
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

const addTriggerUsers = `
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
`;

const addTriggerOrders = `
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
`;

const setupDB = async (db: Pool) => {
  await db.query(createUsersTable);
  await db.query(createProuductTable);
  await db.query(createCartTable);
  await db.query(createCartItemsTable);
  await db.query(createOrdersTable);
  await db.query(createOrderItemsTable);
  await db.query(createTimestampFunc);
  await db.query(addTriggerUsers);
  await db.query(addTriggerOrders);
};

// do not execute setupDb if inside test environment
if (process.env.NODE_ENV !== "test") {
  setupDB(db);
}

export default setupDB;
