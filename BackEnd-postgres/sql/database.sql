CREATE DATABASE ecommerce;

CREATE TABLE users(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    admin BOOLEAN
);

CREATE TABLE favs(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    users_id BIGINT REFERENCES users (id)
);

CREATE TABLE items(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    tag VARCHAR(255) NOT NULL,
    stock SMALLINT NOT NULL
);

 -- SURROGATE TABLE BETWEEN FAVOURITES AND GALLERY_ITEMS
 CREATE TABLE favs_items(
    favs_id BIGINT REFERENCES favs (id),
    items_id BIGINT REFERENCES items (id),
    PRIMARY KEY (favs_id, items_id)
 );

CREATE TABLE cart(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    quantity SMALLINT NOT NULL,
    users_id BIGINT REFERENCES users (id)
);

CREATE TABLE shipping(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    quantity SMALLINT NOT NULL,
    order_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
    users_id BIGINT REFERENCES users (id)
);