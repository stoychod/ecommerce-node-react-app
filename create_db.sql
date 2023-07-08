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

CREATE TABLE IF NOT EXISTS
  product (
    id serial PRIMARY KEY,
    name text NOT NULL,
    description text NOT NULL,
    category varchar(50),
    price int NOT NULL,
    image varchar(255) NOT NULL
  );

CREATE  TABLE IF NOT EXISTS
  cart (
    id serial PRIMARY KEY,
    users_id integer UNIQUE NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_id varchar(100),
    FOREIGN KEY (users_id) REFERENCES users (id) ON DELETE CASCADE
  );

CREATE  TABLE IF NOT EXISTS
  cart_items (
    id serial PRIMARY KEY,
    cart_id integer NOT NULL,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart (id),
    FOREIGN KEY (product_id) REFERENCES product (id)
  );

CREATE  TABLE IF NOT EXISTS
  orders (
    id serial PRIMARY KEY,
    users_id integer NOT NULL,
    total int NOT NULL,
    status varchar(50),
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (users_id) REFERENCES users (id)
  );

CREATE  TABLE IF NOT EXISTS
  order_items (
    id serial PRIMARY KEY,
    orders_id integer NOT NULL,
    product_id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    quantity integer NOT NULL,
    price int NOT NULL,
    created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (orders_id) REFERENCES orders (id)
  );


CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- CREATE TRIGGER set_timestamp
-- BEFORE UPDATE ON cart
-- FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_timestamp();


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- CREATE TRIGGER set_timestamp
-- BEFORE UPDATE ON order_items
-- FOR EACH ROW
-- EXECUTE PROCEDURE trigger_set_timestamp();
