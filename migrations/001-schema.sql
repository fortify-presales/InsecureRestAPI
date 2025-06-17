--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT,
  role TEXT,
  enabled BOOLEAN DEFAULT 1 NOT NULL,
  otp_enabled BOOLEAN DEFAULT 0 NOT NULL,
  otp_secret TEXT
);

CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  summary CLOB,
  description CLOB,
  image TEXT,
  price FLOAT NOT NULL,
  on_sale BOOLEAN DEFAULT 0 NOT NULL,
  sale_price FLOAT DEFAULT 0.0 NOT NULL,
  in_stock BOOLEAN DEFAULT 1 NOT NULL,
  time_to_stock INTEGER DEFAULT 1 NOT NULL,
  rating INTEGER DEFAULT 1 NOT NULL,
  available BOOLEAN DEFAULT 1 NOT NULL
);

CREATE TABLE reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  review_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  comment CLOB,
  rating INTEGER DEFAULT 1 NOT NULL,
  visible BOOLEAN DEFAULT 1 NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products (id),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE reviews;
DROP TABLE products;
DROP TABLE users;