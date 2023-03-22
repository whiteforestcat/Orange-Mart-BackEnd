const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "92344590",
  host: "my-db-instance.chh5epswnlll.ap-southeast-2.rds.amazonaws.com",
  port: 5432,
  database: "ecommerce",
});

module.exports = pool;
