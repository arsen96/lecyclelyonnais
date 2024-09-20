const { Pool } = require('pg');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Création d'un pool de connexions PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,     // Utilisateur de la base de données
  host: process.env.DB_HOST,     // Hôte (ex. localhost)
  database: process.env.DB_NAME, // Nom de la base de données
  password: process.env.DB_PASSWORD, // Mot de passe de la base de données
  port: process.env.DB_PORT,     // Port de connexion (5432 par défaut pour PostgreSQL)
});

// Événement pour indiquer que la connexion au pool est établie
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

module.exports = pool;
