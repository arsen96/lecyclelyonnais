const pool = require('../config/db');


const save = async (req, res) => {
  const { wkt, zoneTitle, zoneStartTime, zoneEndTime, zoneSlotDuration } = req.body;
  console.log("wkt",wkt)
  console.log("zoneTitle",zoneTitle)
  console.log("zoneStartTime",zoneStartTime)
  console.log("zoneEndTime",zoneEndTime)
  console.log("zoneSlotDuration",zoneSlotDuration)

  try {
    // Insérer le WKT dans la base de données PostgreSQL
    const insertZoneQuery = 'INSERT INTO geographical_zone (coordinates, zone_name, zone_start_time, zone_end_time, zone_slot_duration) VALUES (ST_GeomFromText($1, 4326), $2, $3, $4, $5) RETURNING id';
    const result = await pool.query(insertZoneQuery, [wkt, zoneTitle, zoneStartTime, zoneEndTime, zoneSlotDuration]);
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
    const query = `SELECT gz.id,
    gz.zone_name, 
    to_char(gz.created_at, 'YYYY-MM-DD') as created_at,
    ST_AsGeoJSON(gz.coordinates) AS geojson,
    json_agg(
      CASE 
        WHEN tz.id IS NOT NULL THEN json_build_object('id', tz.id, 'first_name', tz.first_name, 'last_name', tz.last_name)
        ELSE NULL
      END
    ) AS technicians
    FROM geographical_zone gz
    LEFT JOIN technician tz ON tz.geographical_zone_id = gz.id
    GROUP BY gz.id`;
    const result = await pool.query(query);

    const data = result.rows.map(row => {
      return {
        ...row,
        technicians: row.technicians.filter(technician => technician !== null)
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des zones" });
  }
};

const deleteSelected = async (req, res) => {
  const { ids } = req.body;
  try {
    const dissociateTechniciansQuery = 'UPDATE technician SET geographical_zone_id = NULL, address = NULL WHERE geographical_zone_id = ANY($1::int[])';
    await pool.query(dissociateTechniciansQuery, [ids]);
    
    const deleteQuery = 'DELETE FROM geographical_zone WHERE id = ANY($1::int[])';
    await pool.query(deleteQuery, [ids]);
    let message = ids.length > 1 ? "Les zones ont été supprimées" : "La zone a été supprimée";
    res.status(200).json({ success: true, message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la suppression des zones" });
  }
};  

const removeTechnicianFromZone = async (req, res) => {
  const {technicianId } = req.body;
  try {
    const updateQuery = 'UPDATE technician SET geographical_zone_id = NULL, address = NULL WHERE id = $1';
    await pool.query(updateQuery, [technicianId]);
    res.status(200).json({ success: true, message: "Technicien supprimé de la zone" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la suppression du technicien de la zone" });
  }
};


const addTechnicianToZone = async (req, res) => {
  try {
    const { technician_ids, zone_id } = req.body;

    // Récupérer le centre de la zone
    const centerQuery = `
      SELECT ST_AsText(ST_Centroid(coordinates)) AS center
      FROM geographical_zone
      WHERE id = $1
    `;
    const centerResult = await pool.query(centerQuery, [zone_id]);
    const centerPoint = centerResult.rows[0].center;
    console.log("centerPoint",centerPoint)
    console.log("centerResult.rows[0]", centerResult.rows[0]);
    // Extraire les coordonnées du centre
    const [lon, lat] = centerPoint.match(/POINT\(([^ ]+) ([^ ]+)\)/).slice(1, 3);
    // Utiliser une API de géocodage inversé pour obtenir l'adresse
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(reverseGeocodeUrl);
    const data = await response.json();
    const address = data.display_name;
    console.log("address",address)
    // Mettre à jour les techniciens avec la zone et l'adresse
    const query = 'UPDATE technician SET geographical_zone_id = $1, address = $2 WHERE id = ANY($3::int[])';
    await pool.query(query, [zone_id, address, technician_ids]);

    res.status(200).send({ success: true, message: "Techniciens mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).send({success: false, message: 'Erreur lors de la mise à jour des techniciens'});
  }
}


const isAddressInZone = async (req, res) => {
  const { address } = req.body;
  console.log("address", address);
  const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const response = await fetch(nominatimUrl);
  const data = await response.json();
  let notFoundMessage = "Nous n'avons pas de technicien dans votre zone";
  if (data.length === 0) {
    return res.status(404).json({ success: false, message: notFoundMessage });
  }

  const { lat, lon } = data[0];
  const point = `POINT(${lon} ${lat})`;
  const query = `SELECT id FROM geographical_zone WHERE ST_Contains(coordinates, ST_GeomFromText($1, 4326)) LIMIT 1`;
  const result = await pool.query(query, [point]);
  const zoneConcerned = result.rows[0]?.id;
  console.log("zoneConcerned",zoneConcerned)
  res.status(200).json({ success: zoneConcerned, message: !zoneConcerned ? notFoundMessage : "" });
}

module.exports = { save,get,deleteSelected,removeTechnicianFromZone,addTechnicianToZone,isAddressInZone }