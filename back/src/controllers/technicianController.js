const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch'); 
const {subdomainInfo} = require("../controllers/companyController")
/**
 * Convertir une adresse en coordonnées géographiques et trouver l'ID de la zone géographique
 * @param {string} address - L'adresse à convertir
 * @returns {Promise<number|null>} - L'ID de la zone géographique
 */
const getGeographicalZoneId = async (address) => {
  if (!address || address.length === 0) {
    return null;
  }
  
  try {
    if (typeof address !== 'string' || address.length > 500) {
      throw new Error('Adresse invalide');
    }
    
    // Sanitisation : supprimer caractères dangereux
    const sanitizedAddress = address
      .replace(/[<>\"']/g, '') // Supprimer caractères HTML
      .replace(/[&]/g, 'and')   // Remplacer & par "and"
      .trim();
    
    if (sanitizedAddress.length === 0) {
      return null;
    }
    
    // construction sécurisée avec URLSearchParams pour sonarqube
    const baseUrl = 'https://nominatim.openstreetmap.org/search';
    const params = new URLSearchParams({
      format: 'json',
      q: sanitizedAddress,
      limit: '1', // limiter le nombre de résultats
    });
    
    const nominatimUrl = `${baseUrl}?${params.toString()}`;
    
    // Timeout pour éviter les requêtes longues
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(nominatimUrl, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const { lat, lon } = data[0];
    
    if (!lat || !lon || isNaN(parseFloat(lat)) || isNaN(parseFloat(lon))) {
      return null;
    }
    
    const point = `POINT(${parseFloat(lon)} ${parseFloat(lat)})`;

    const zoneQuery = `
      SELECT id FROM geographical_zone 
      WHERE ST_Contains(coordinates, ST_GeomFromText($1, 4326))
    `;
    const zoneResult = await pool.query(zoneQuery, [point]);
    return zoneResult.rows.length > 0 ? zoneResult.rows[0].id : null;
    
  } catch (error) {
    console.error('Erreur lors de la géolocalisation:', error);
    return null; 
  }
};

/**
 * Créer un nouveau technicien
 */
const save = async (req, res) => {
  try {
    const { last_name, first_name, phone, address, password, email, domain } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const geographical_zone_id = await getGeographicalZoneId(address);
    const companyId = await subdomainInfo(domain);
    const isEmailUsed = await pool.query('SELECT EXISTS(SELECT 1 FROM client WHERE email = $1)', [email]);
    if(isEmailUsed.rows[0].exists){
      console.log("10. Email déjà utilisé");
      res.status(400).send({ success: false, message: "Cet email est déjà utilisé" });
      return;
    }
    
    const query = 'INSERT INTO technician (last_name, first_name, phone, address, password, email, geographical_zone_id,company_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
    await pool.query(query, [last_name, first_name, phone, address, hashedPassword, email, geographical_zone_id, companyId]);
    
    res.status(201).send({ success: true, message: "Technicien créé avec succès" });
    
  } catch (error) {
    console.error("ERREUR dans save:", error);
    if (error.code === '23505') {
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
    const geographical_zone_id = await getGeographicalZoneId(address);

    if (password) {
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

/**
 * Supprime plusieurs techniciens avec gestion des contraintes d'intégrité
 */
const deleteSelected = async (req, res) => {
  try {
    const { ids } = req.body;
    const deleteQuery = 'DELETE FROM technician WHERE id = ANY($1::int[])';
    
    const result = await pool.query(deleteQuery, [ids]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Aucun technicien trouvé avec ces IDs" 
      });
    }
    
    if (result.rowCount < ids.length) {
      return res.status(207).json({ 
        success: true, 
        message: `${result.rowCount} technicien(s) supprimé(s) sur ${ids.length} demandé(s)` 
      });
    }
    
    let message = ids.length > 1 ? "Les techniciens ont été supprimés" : "Le technicien a été supprimé";
    res.status(200).json({ success: true, message });
    
  } catch (error) {
    if (error.code === '23503') {
      res.status(400).send({ success: false, message: "Ce technicien est lié à une intervention" });
      return;
    }
    console.error(error);
    res.status(500).send('Error deleting technicians');
  }
};



module.exports = { save,get,update,deleteSelected }