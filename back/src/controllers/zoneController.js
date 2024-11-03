const pool = require('../config/db'); // Connexion à PostgreSQL via le pool
/**
 * Créer un nouveau client
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns obtenir le token de session
 */
const save = async (req, res) => {
  const { wkt, zoneName } = req.body;
  console.log("wkt",wkt)
  console.log("zoneName",zoneName)
  try {
    // Insérer le WKT dans la base de données PostgreSQL
    const insertZoneQuery = 'INSERT INTO geographical_zone (coordinates, zone_name) VALUES (ST_GeomFromText($1, 4326), $2) RETURNING id';
    const result = await pool.query(insertZoneQuery, [wkt, zoneName]);
    console.log("result",result)
    res.status(201).json({
      success: true,
      message: "Zone sauvegardée",
      zoneId: result.rows[0].id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la sauvegarde de la zone" });
  }
};

// https://postgis.net/docs/manual-1.5/ch08.html
const get = async (req, res) => {
  try {
    const query = `SELECT id,
        zone_name, 
        to_char(created_at, 'YYYY-MM-DD') as created_at,
        ST_AsGeoJSON(coordinates) AS geojson FROM geographical_zone`;
    const result = await pool.query(query);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des zones" });
  }
};

const deleteSelected = async (req, res) => {
  const { ids } = req.body;
  console.log("idsidsids",ids)
  try {
    const deleteQuery = 'DELETE FROM geographical_zone WHERE id = ANY($1::int[])';
    await pool.query(deleteQuery, [ids]);
    res.status(200).json({ success: true, message: "Zones supprimées" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la suppression des zones" });
  }
};

module.exports = { save,get,deleteSelected }