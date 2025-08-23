const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();


console.log("process.env.DB_USER", process.env.DB_USER)
console.log("process.env.DB_HOST", process.env.DB_HOST)
console.log("process.env.DB_NAME", process.env.DB_NAME)
console.log("process.env.DB_PASSWORD", process.env.DB_PASSWORD)
console.log("process.env.DB_PORT", process.env.DB_PORT)

// Création d'un pool de connexions PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,    
  host: process.env.DB_HOST,     
  database: process.env.DB_NAME, 
  password: process.env.DB_PASSWORD, 
  port: process.env.DB_PORT,     
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

module.exports = pool;
