CREATE DATABASE ecommerce;

CREATE TABLE user_accounts(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    admin BOOLEAN
);

CREATE TABLE item_gallery(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(50) NOT NULL,
    tags VARCHAR(50) NOT NULL,
    stock SMALLINT NOT NULL
);

CREATE TABLE user_cart(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    quantity SMALLINT NOT NULL,
);

CREATE TABLE shipping(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    order_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
);