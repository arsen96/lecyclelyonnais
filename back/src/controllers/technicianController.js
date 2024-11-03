const pool = require('../config/db'); // Connexion à PostgreSQL via le pool
/**
 * Créer un nouveau client
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns obtenir le token de session
 */
const save = async (req, res) => {
  try {
    const { last_name, first_name,phone,address,password,email } = req.body;

    // console.log("last_name", last_name)
    // console.log("first_name", first_name)
    // console.log("phone", phone)
    // console.log("address", address)
    // console.log("password", password)
    // console.log("email", email)
    // console.log("address current msg",address)
    const query = 'INSERT INTO technician (last_name, first_name,phone,address,password,email) VALUES ($1, $2, $3, $4, $5, $6)';
    await pool.query(query, [last_name, first_name,phone,address,password,email]);
    res.status(201).send({success: true, message: "Technicien créé avec succès"});
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // PostgreSQL error code for unique violation
      res.status(400).send({success: false, message: "Un technicien avec cette adresse email existe déjà"});
    } else {
      res.status(500).send({success: false, message: "Erreur lors de la création du technicien"});
    }
  }
};

// https://postgis.net/docs/manual-1.5/ch08.html
const get = async (req, res) => {
  try {
    const query = 'SELECT * FROM technician';
    const result = await pool.query(query);
    console.log("result", result.rows)
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching technicians');
  }
};

const deleteSelected = async (req, res) => {
  try {
    const { technicianIds } = req.body;
    const query = 'DELETE FROM technician WHERE id IN ($1)';
    await pool.query(query, [technicianIds]);
    res.status(200).send('Technicians deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting technicians');
  }
};

module.exports = { save,get,deleteSelected }