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
    description text NOT NULL,
    ingredients text NOT NULL,
    price DECIMAL(5,2) NOT NULL,
    dietary VARCHAR(255) NOT NULL,
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
    -- quantity SMALLINT NOT NULL,
    users_id BIGINT REFERENCES users (id)
);

 -- SURROGATE TABLE BETWEEN CART AND GALLERY_ITEMS
  CREATE TABLE cart_items(
    cart_id BIGINT REFERENCES cart (id),
    items_id BIGINT REFERENCES items (id),
    quantity SMALLINT NOT NULL,
    PRIMARY KEY (cart_id, items_id)
 );

CREATE TABLE shipment(
    id BIGSERIAL NOT NULL PRIMARY KEY,
    -- quantity SMALLINT NOT NULLL,
    order_date DATE DEFAULT CURRENT_DATE,
    delivery_date DATE DEFAULT CURRENT_DATE + 3,
    -- quantity SMALLINT NOT NULL,
    -- order_date DATE NOT NULL,
    -- delivery_date DATE NOT NULL,
    users_id BIGINT REFERENCES users (id)
);

  -- SURROGATE TABLE BETWEEN CART AND SHIPMENT
    CREATE TABLE cart_shipment(
    cart_id BIGINT REFERENCES cart (id),
    shipment_id BIGINT REFERENCES shipment (id),
    -- items_id BIGINT REFERENCES items (id),
    -- quantity SMALLINT NOT NULL,
    PRIMARY KEY (cart_id, shipment_id)
 );

  -- SURROGATE TABLE BETWEEN SHIPMENT AND ITEM
    CREATE TABLE shipment_items(
    shipment_id BIGINT REFERENCES shipment (id),
    items_id BIGINT REFERENCES items (id),
    quantity SMALLINT NOT NULL,
    PRIMARY KEY (shipment_id, items_id)
 );
 