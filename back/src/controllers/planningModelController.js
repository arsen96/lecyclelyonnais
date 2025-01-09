const pool = require('../config/db');
const { subdomainInfo } = require("../controllers/companyController");

const save = async (req, res) => {
    const {domain} = req.body;
    const companyId = await subdomainInfo(domain);
    const query = 'INSERT INTO planning_models (name, intervention_type, slot_duration, start_time, end_time, available_days, company_id) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    
    // Ensure start_time and end_time are in the correct format
    const startTime = formatTime(req.body.start_time);

    const endTime = formatTime(req.body.end_time);
    const values = [req.body.name, req.body.intervention_type, req.body.slot_duration, startTime, endTime, req.body.available_days, companyId];
    
    try {
        await pool.query(query, values);
        res.status(200).json({ success: true, message: "Modèle de planning enregistré avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Erreur lors de l'enregistrement du modèle de planning" });
    }
}

function formatTime(time) {
    if (typeof time === 'string' && time.includes(':')) {
        return time;
    }
    if (typeof time === 'number' || (typeof time === 'string' && !time.includes(':'))) {
        const [hours, minutes] = String(time).split('.');
        const formattedHours = hours.padStart(2, '0');
        const formattedMinutes = (minutes || '0').padEnd(2, '0').slice(0, 2);
        return `${formattedHours}:${formattedMinutes}:00`;
    }
    const timeStr = String(time);
    return `${timeStr.padStart(2, '0')}:00:00`;
}


const get = async (req, res) => {
    const {domain} = req.query;
    const companyId = await subdomainInfo(domain);
    const query = 'SELECT * FROM planning_models WHERE company_id = $1';
    const result = await pool.query(query,[companyId]);
    res.status(200).json({success:true,data:result.rows});
}


const update = async (req, res) => {
    try{
        const startTime = formatTime(req.body.start_time);
        const endTime = formatTime(req.body.end_time);
        const query = 'UPDATE planning_models SET name = $1, intervention_type = $2, slot_duration = $3, start_time = $4, end_time = $5, available_days = $6 WHERE id = $7';
        const values = [req.body.name, req.body.intervention_type, req.body.slot_duration, startTime, endTime, req.body.available_days, req.params.id];
        await pool.query(query, values);
        res.status(200).json({success:true,message:"Modèle de planning mis à jour avec succès"});
    }catch(error){
        console.log(error);
        res.status(500).json({success:false,message:"Erreur lors de la mise à jour du modèle de planning"});
    }
}

const deleteModel = async (req, res) => {
    try {
        const {domain} = req.body;
        const companyId = await subdomainInfo(domain);
        // Delete from planning_model_zones first
        const deleteZonesQuery = 'DELETE FROM planning_model_zones WHERE planning_model_id_maintenance = ANY($1) OR planning_model_id_repair = ANY($1)';
        await pool.query(deleteZonesQuery, [req.body.ids]);

        // Then delete from planning_models
        const deleteModelsQuery = 'DELETE FROM planning_models WHERE id = ANY($1) AND company_id = $2';
        
        await pool.query(deleteModelsQuery, [req.body.ids, companyId]);
        res.status(200).json({ success: true, message: "Modèle de planning et zones associés supprimés avec succès" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Erreur lors de la suppression du modèle de planning et des zones associées" });
    }
}


const addPlanningModel = async (req, res) => {
    const { zoneId, zoneTypeInterventionMaintenance, zoneTypeInterventionRepair } = req.body;
    const query = 'INSERT INTO planning_model_zones (zone_id, planning_model_id_maintenance,planning_model_id_repair) VALUES ($1, $2, $3)';
    return await pool.query(query, [zoneId, zoneTypeInterventionMaintenance, zoneTypeInterventionRepair]);
  }



  const updateZonePlanningModel = async (req, res) => {
    const { zoneId, zoneTypeInterventionMaintenance, zoneTypeInterventionRepair } = req.body;

    try {
      // Check if the planning model zone already exists
      const checkQuery = 'SELECT COUNT(*) FROM planning_model_zones WHERE zone_id = $1';
      const checkResult = await pool.query(checkQuery, [zoneId]);
      const exists = parseInt(checkResult.rows[0].count) > 0;

      if (!exists) {
        // If it doesn't exist, insert a new record
        const insertQuery = 'INSERT INTO planning_model_zones (zone_id, planning_model_id_maintenance, planning_model_id_repair) VALUES ($1, $2, $3)';
        await pool.query(insertQuery, [zoneId, zoneTypeInterventionMaintenance, zoneTypeInterventionRepair]);
      } else {
        // If it exists, update the existing record
        const updateQuery = 'UPDATE planning_model_zones SET planning_model_id_maintenance = $1, planning_model_id_repair = $2 WHERE zone_id = $3';
        await pool.query(updateQuery, [zoneTypeInterventionMaintenance, zoneTypeInterventionRepair, zoneId]);
      }

      res.status(200).json({ success: true, message: "Modèle de planning mis à jour avec succès" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du modèle de planning" });
    }
  }

module.exports = {
    save,
    get,
    update,
    deleteModel,
    managePlanningModel: addPlanningModel,
    updateZonePlanningModel
}