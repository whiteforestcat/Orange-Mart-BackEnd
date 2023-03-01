CREATE DATABASE ecommerce;

CREATE TABLE user_accounts(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    admin BOOLEAN
);

CREATE TABLE favourites(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(50) NOT NULL,
    price SMALLINT NOT NULL,
    account_id BIGINT REFERENCES user_accounts (id)
);

CREATE TABLE gallery_items(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(50) NOT NULL,
    price SMALLINT NOT NULL,
    tags VARCHAR(50) NOT NULL,
    stock SMALLINT NOT NULL
);

 -- SURROGATE TABLE BETWEEN FAVOURITES AND GALLERY_ITEMS
 CREATE TABLE favourites_gallery_items(
    favourites_id BIGINT REFERENCES gallery_items (id),
    gallery_items_id BIGINT REFERENCES favourites (id),
    PRIMARY KEY (favourites_id, gallery_items_id)
 );

CREATE TABLE user_cart(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(50) NOT NULL,
    price SMALLINT NOT NULL,
    quantity SMALLINT NOT NULL,
    account_id BIGINT REFERENCES user_accounts (id)
);

CREATE TABLE shipping(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(50) NOT NULL,
    price SMALLINT NOT NULL,
    quantity SMALLINT NOT NULL,
    order_date DATE NOT NULL,
    delivery_date DATE NOT NULL,
    account_id BIGINT REFERENCES user_accounts (id)
);