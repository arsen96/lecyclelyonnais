const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const dbHost = process.env.ENVIRONMENT === 'docker' ? process.env.DB_HOST : process.env.DB_HOST_LOCAL;

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
