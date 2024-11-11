const pool = require('../config/db'); // Connexion à PostgreSQL via le pool
const bcrypt = require('bcrypt');
const fetch = require('node-fetch'); // Assurez-vous d'installer node-fetch
/**
 * Créer un nouveau client
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns obtenir le token de session
 */

const save = async (req, res) => {
  try {
    const { last_name, first_name, phone, address, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO technician (last_name, first_name, phone, address, password, email) VALUES ($1, $2, $3, $4, $5, $6)';
    await pool.query(query, [last_name, first_name, phone, address, hashedPassword, email]);
    res.status(201).send({ success: true, message: "Technicien créé avec succès" });
  } catch (error) {
    console.error(error);
    if (error.code === '23505') { // PostgreSQL error code for unique violation
      res.status(400).send({ success: false, message: "Un technicien avec cette adresse email existe déjà" });
    } else {
      res.status(500).send({ success: false, message: "Erreur lors de la création du technicien" });
    }
  }
};

// https://postgis.net/docs/manual-1.5/ch08.html
const get = async (req, res) => {
  try {
    const query = 'SELECT *, to_char(created_at, \'YYYY-MM-DD\') as created_at FROM technician';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching technicians');
  }
};

const update = async (req, res) => {
  try {
    const { id, last_name, first_name, phone, address, password, email } = req.body;
    let query, values;
    console.log("address", address)
    console.log("id", id)
    console.log("last_name", last_name)
    console.log("first_name", first_name)
    console.log("phone", phone)
    console.log("email", email)
    let geographical_zone_id;
    // Convertir l'adresse en coordonnées géographiques
    if(address?.length > 0){
      const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
      const response = await fetch(nominatimUrl);
      const data = await response.json();

      if (data.length === 0) {
      return res.status(400).send({ success: false, message: "Adresse non trouvée" });
      }

      const { lat, lon } = data[0];
      const point = `POINT(${lon} ${lat})`;

        const zoneQuery = `
        SELECT id FROM geographical_zone 
        WHERE ST_Contains(coordinates,  ST_GeomFromText($1, 4326))
      `;
      const zoneResult = await pool.query(zoneQuery, [point]);
      geographical_zone_id = zoneResult.rows.length > 0 ? zoneResult.rows[0].id : null;
    }



    // Vérifier si les coordonnées se trouvent dans une zone géographique


    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE technician SET last_name = $1, first_name = $2, phone = $3, address = $4, password = $5, email = $6, geographical_zone_id = $7 WHERE id = $8';
      values = [last_name, first_name, phone, address, hashedPassword, email, geographical_zone_id, id];
    } else {
      query = 'UPDATE technician SET last_name = $1, first_name = $2, phone = $3, address = $4, email = $5, geographical_zone_id = $6 WHERE id = $7';
      values = [last_name, first_name, phone, address, email, geographical_zone_id, id];
    }

    const updateResult = await pool.query(query, values);
    if (updateResult.rowCount === 0) {
      return res.status(404).send({ success: false, message: "Technicien non trouvé" });
    }

    console.log("updateResult", updateResult.rows[0])

    res.status(200).send({ success: true, message: "Technicien mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Erreur lors de la mise à jour du technicien" });
  }
};

const deleteSelected = async (req, res) => {
  try {
    const { ids } = req.body;
    const deleteQuery = 'DELETE FROM technician WHERE id = ANY($1::int[])';
    await pool.query(deleteQuery, [ids]);
    let message = ids.length > 1 ? "Les techniciens ont été supprimés" : "Le technicien a été supprimé";
    res.status(200).json({ success: true, message});
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting technicians');
  }
};



module.exports = { save,get,update,deleteSelected }