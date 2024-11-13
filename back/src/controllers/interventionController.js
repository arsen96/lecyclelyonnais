const pool = require('../config/db');
const bicycleController = require('./bicycleController');

const save = async (req, res) => {
    const { repair, maintenance, operation, details, address, userId } = req.body;
    const isMaintenance = operation.operation === "maintenance";
    
    try {
        const bicycle = await bicycleController.save(req, res);
        const selectTechnicianQuery = "SELECT id FROM technician WHERE geographical_zone_id = $1 AND is_available = true LIMIT 1";
        const technicianResult = await pool.query(selectTechnicianQuery, [address.zone]);
        const technicianId = technicianResult.rows[0]?.id;
        
        const appointmentStart = isMaintenance ? maintenance.scheduleTimeStart : repair.scheduleTimeStart;
        const appointmentEnd = isMaintenance ? maintenance.scheduleTimeEnd : repair.scheduleTimeEnd;
        const description = isMaintenance ? "" : repair.issueDetails;
        const package = isMaintenance ? maintenance.package : "";
        console.log("package", package)
        console.log("maintenance", maintenance)
        const query = 'INSERT INTO intervention (type, bicycle_id, technician_id, client_id, status, description, appointment_start, appointment_end,package) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9)';
        await pool.query(query, [operation.operation, bicycle.id, technicianId, userId, "", description, appointmentStart, appointmentEnd,package]);
        
        res.status(200).send({ success: true, message: "Intervention créée avec succès", data: bicycle });
    } catch (error) {
        res.status(500).send({ success: false, message: "Erreur lors de la création de l'intervention", error: error.message });
    }
}

const get = async (req, res) => {
    const query = 'SELECT * FROM intervention';
    const result = await pool.query(query);
    res.status(200).send({ success: true, message: "Interventions récupérées avec succès", data: result.rows });
}

module.exports = {
    save,
    get
}   
