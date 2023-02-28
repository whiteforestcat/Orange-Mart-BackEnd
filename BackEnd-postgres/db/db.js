const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgress",
  password: "92344590",
  host: "localhost",
  port: 5432,
  database: "ecommerce",
});

module.exports = pool;
