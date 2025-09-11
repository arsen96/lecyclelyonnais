const pool = require('../config/db');
const planningModelService = require('./planningModelController');
const {subdomainInfo} = require("../controllers/companyController")

/**
 * Crée une nouvelle zone géographique avec modèle de planning associé
 * @param {Object} req.body - wkt (format géométrique)
 * @returns {Object} ID de la zone créée
 */
const save = async (req, res) => {
  const { wkt, zoneTitle,domain } = req.body;
  const companyId = await subdomainInfo(domain);

  try {
    // Insérer le WKT dans la base de données PostgreSQL
    const insertZoneQuery = 'INSERT INTO geographical_zone (coordinates, zone_name,company_id) VALUES (ST_GeomFromText($1, 4326), $2, $3) RETURNING id';
    const result = await pool.query(insertZoneQuery, [wkt, zoneTitle,companyId]);
    const zoneId = result.rows[0].id;

    // Transmettre l'ID de la zone à managePlanningModel
    try{
      await planningModelService.managePlanningModel({ ...req, body: { ...req.body, zoneId } }, res);
    }catch(error){
      console.error(error);
      res.status(500).json({ success: false, message: "Erreur lors de la gestion du modèle de planning" });
    }
    
    res.status(201).json({
      success: true,
      message: "Zone sauvegardée",
      zoneId: zoneId
    });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la zone", error);
    res.status(500).json({ success: false, message: "Erreur lors de la sauvegarde de la zone" });
  }
};

/**
 * Récupère les zones avec techniciens et modèles de planning associés
 * @returns {Object} Zones avec données géographiques et planning
 * https://postgis.net/docs/manual-1.5/ch08.html
 */
const get = async (req, res) => {
  const { domain } = req.query;
  try {
    const query = `
      SELECT gz.id,
             gz.zone_name, 
             to_char(gz.created_at, 'YYYY-MM-DD') as created_at,
             ST_AsGeoJSON(gz.coordinates) AS geojson,
             json_agg(
               CASE 
                 WHEN tz.id IS NOT NULL THEN json_build_object('id', tz.id, 'first_name', tz.first_name, 'last_name', tz.last_name)
                 ELSE NULL
               END
             ) AS technicians,
             json_build_object(
               'maintenance', json_build_object(
                 'id', pm_maintenance.id,
                 'type', pm_maintenance.intervention_type,
                 'available_days', pm_maintenance.available_days,
                 'slot_duration', pm_maintenance.slot_duration,
                 'start_time', pm_maintenance.start_time,
                 'end_time', pm_maintenance.end_time
               ),
               'repair', json_build_object(
                 'id', pm_repair.id,
                 'type', pm_repair.intervention_type,
                 'available_days', pm_repair.available_days,
                 'slot_duration', pm_repair.slot_duration,
                 'start_time', pm_repair.start_time,
                 'end_time', pm_repair.end_time
               )
             ) as model_planification
      FROM geographical_zone gz
      LEFT JOIN technician tz ON tz.geographical_zone_id = gz.id
      LEFT JOIN planning_model_zones pmz ON pmz.zone_id = gz.id
      LEFT JOIN planning_models pm_maintenance ON pmz.planning_model_id_maintenance = pm_maintenance.id
      LEFT JOIN planning_models pm_repair ON pmz.planning_model_id_repair = pm_repair.id
      WHERE gz.company_id = $1
      GROUP BY gz.id, pm_maintenance.id, pm_maintenance.intervention_type, pm_maintenance.available_days, 
      pm_maintenance.slot_duration, pm_maintenance.start_time, pm_maintenance.end_time, 
      pm_repair.id, pm_repair.intervention_type, pm_repair.available_days, pm_repair.slot_duration, 
      pm_repair.start_time, pm_repair.end_time
    `;
    const companyId = await subdomainInfo(domain);
    const result = await pool.query(query, [companyId]);
    const data = result.rows.map(row => {
      return {
        ...row,
        technicians: row.technicians.filter(technician => technician !== null)
      };
    });

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Erreur lors de la récupération des zones", error);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des zones" });
  }
};


const updateZone = async (req, res) => {
  const { zoneId, zoneTitle} = req.body;
  const query = 'UPDATE geographical_zone SET zone_name = $1 WHERE id = $2';
  try { 
    await pool.query(query, [zoneTitle, zoneId]);
    await planningModelService.updateZonePlanningModel({ ...req, body: { ...req.body, zoneId } });
    res.status(200).json({ success: true, message: "La zone a été mise à jour" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la zone", error);
    res.status(500).json({ success: false, message: "Erreur lors de la mise à jour de la zone" });
  }
}




/**
 * Supprime plusieurs zones avec dissociation automatique des techniciens
 */
const deleteSelected = async (req, res) => {
  const { ids } = req.body;
  
  // Validation des paramètres
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: "Aucun ID de zone fourni" 
    });
  }

  try {
    const checkQuery = 'SELECT id FROM geographical_zone WHERE id = ANY($1::int[])';
    const checkResult = await pool.query(checkQuery, [ids]);
    const existingZones = checkResult.rows.map(row => row.id);
    
    if (existingZones.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: ids.length > 1 ? "Aucune des zones spécifiées n'existe" : "La zone spécifiée n'existe pas"
      });
    }

    const notFoundZones = ids.filter(id => !existingZones.includes(id));
    if (notFoundZones.length > 0) {
      return res.status(404).json({ 
        success: false, 
        message: `Zone(s) non trouvée(s): ${notFoundZones.join(', ')}`
      });
    }

    const dissociateTechniciansQuery = 'UPDATE technician SET geographical_zone_id = NULL, address = NULL WHERE geographical_zone_id = ANY($1::int[])';
    const dissociateResult = await pool.query(dissociateTechniciansQuery, [existingZones]);
    
    const deleteQuery = 'DELETE FROM geographical_zone WHERE id = ANY($1::int[])';
    const deleteResult = await pool.query(deleteQuery, [existingZones]);
    
    let message = `${deleteResult.rowCount} zone(s) supprimée(s) avec succès`;
    if (dissociateResult.rowCount > 0) {
      message += ` (${dissociateResult.rowCount} technicien(s) dissocié(s))`;
    }
    
    res.status(200).json({ 
      success: true, 
      message,
      deletedCount: deleteResult.rowCount,
      dissociatedTechnicians: dissociateResult.rowCount
    });

  } catch (error) {
    console.error("Erreur lors de la suppression des zones", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de la suppression des zones" 
    });
  }
}; 
const removeTechnicianFromZone = async (req, res) => {
  const {technicianId } = req.body;
  try {
    const updateQuery = 'UPDATE technician SET geographical_zone_id = NULL, address = NULL WHERE id = $1';
    await pool.query(updateQuery, [technicianId]);
    res.status(200).json({ success: true, message: "Technicien supprimé de la zone" });
  } catch (error) {
    console.error("Erreur lors de la suppression du technicien de la zone", error);
    res.status(500).json({ success: false, message: "Erreur lors de la suppression du technicien de la zone" });
  }
};


/**
 * Ajoute des techniciens à une zone avec géocodage automatique de l'adresse
 */
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
    // Extraire les coordonnées du centre
    const [lon, lat] = centerPoint.match(/POINT\(([^ ]+) ([^ ]+)\)/).slice(1, 3);
    // Utiliser une API de géocodage inversé pour obtenir l'adresse
    const reverseGeocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(reverseGeocodeUrl);
    const data = await response.json();
    const address = data.display_name;
    // Mettre à jour les techniciens avec la zone et l'adresse
    const query = 'UPDATE technician SET geographical_zone_id = $1, address = $2 WHERE id = ANY($3::int[])';
    await pool.query(query, [zone_id, address, technician_ids]);

    if(technician_ids.length > 1){
      res.status(200).send({ success: true, message: "Les techniciens ont été ajoutés à la zone" });
    }else{
      res.status(200).send({ success: true, message: "Le technicien a bien été ajouté à la zone" });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour des techniciens", error);
    res.status(500).send({success: false, message: 'Erreur lors de la mise à jour des techniciens'});
  }
}


/**
 * Vérifie si une adresse se trouve dans une zone avec technicien disponible
 */
const isAddressInZone = async (req, res) => {
  try {
    const { address } = req.body;
    console.log("address", address);
    
    const baseUrl = 'https://nominatim.openstreetmap.org/search';
    const params = new URLSearchParams({
      format: 'json',
      q: address
    });
    const nominatimUrl = `${baseUrl}?${params.toString()}`;
    
    const response = await fetch(nominatimUrl);
    const data = await response.json();
    let notFoundMessage = "Nous n'avons pas de technicien dans votre zone";
    if (data.length === 0) {
      throw new Error(notFoundMessage);
    }

    const { lat, lon } = data[0];
    const point = `POINT(${lon} ${lat})`;
    const query = `SELECT id, zone_name FROM geographical_zone 
    WHERE ST_Contains(coordinates, ST_GeomFromText($1, 4326)) LIMIT 1`;
    const result = await pool.query(query, [point]);
    const zoneConcerned = result.rows[0]?.id;

    if (!zoneConcerned) {
      throw new Error(notFoundMessage);
    } else {
      // Vérifier si des techniciens sont dans cette zone
      const technicianQuery = `SELECT COUNT(*) FROM technician WHERE geographical_zone_id = $1`;
      const technicianResult = await pool.query(technicianQuery, [zoneConcerned]);
      const technicianCount = parseInt(technicianResult.rows[0].count, 10);

      if (technicianCount === 0) {
        throw new Error(notFoundMessage);
      }

      res.status(200).json({ success: zoneConcerned, message: "" });
    }
  } catch (error) {
    console.error("Erreur lors de la vérification de l'adresse", error);
    res.status(500).json({ success: false, message: error.message || "Erreur lors de la vérification de l'adresse" });
  }
}

module.exports = { save,get,deleteSelected,removeTechnicianFromZone,addTechnicianToZone,isAddressInZone,updateZone }