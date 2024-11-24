const pool = require('../config/db');
const bicycleController = require('./bicycleController');
const multer = require('multer');


const filePathOperation = 'uploads/bicycles/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, filePathOperation);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    },
});

const upload = multer({ storage: storage }).array('photos');

const save = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(500).send({ success: false, message: "Erreur lors du téléchargement des photos", error: err });
        }

        const { repair, maintenance, operation, details, address, userId } = JSON.parse(req.body.intervention);
        // const { photos2 } = JSON.parse(req.body.photos);
        const photos = req.files;
        console.log("photosphotos", photos)
        // console.log("photos2", photos2)
        console.log("photos", photos)
        // console.log("repair", repair);
        // console.log("req.body", req.body);
        // console.log("photos", photos);

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
            
            const queryIntervention = 'INSERT INTO intervention (type, bicycle_id, technician_id, client_id, status, description, appointment_start, appointment_end, package) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
            const result = await pool.query(queryIntervention, [operation.operation, bicycle.id, technicianId, userId, "", description, appointmentStart, appointmentEnd, package]);
            const intervention = result.rows[0];
            if (photos) {
                await uploadOperationPhotos(photos, intervention.id);
            }

            
                res.status(200).send({ success: true, message: "Intervention créée avec succès", data: intervention });
        } catch (error) {
            res.status(500).send({ success: false, message: "Erreur lors de la création de l'intervention", error: error.message });
        }
    });
}

const get = async (req, res) => {
    const query = 'SELECT intervention.*, array_agg(intervention_photos.file_path) as photos FROM intervention LEFT JOIN intervention_photos ON intervention.id = intervention_photos.intervention_id GROUP BY intervention.id';
    const result = await pool.query(query);
    const data = result.rows.map(row => {
        return {
          ...row,
          photos: row.photos.filter(photo => photo !== null)
        };
      });
    const id = result.rows.filter(row => row.photos?.length > 0 && row.photos[0] !== null);
    // console.log("result", result.rows)
    // console.log("id", id)
    res.status(200).send({ success: true, message: "Interventions récupérées avec succès", data});
}


const uploadOperationPhotos = async (files,interventionId) => {
    return new Promise(async (resolve, reject) => {
        const query = 'INSERT INTO intervention_photos (intervention_id, file_path) VALUES ($1, $2)';
        
        try {
            for (const file of files) {
                const filePath = filePathOperation + file.filename;
                console.log("filePath", filePath);
                await pool.query(query, [interventionId, filePath]);
            }
            resolve(true);
        } catch (dbError) {
            console.error("Database error:", dbError);
            reject(dbError);
        }
    });
};

module.exports = {
    save,
    get,
    uploadOperationPhotos
}   
