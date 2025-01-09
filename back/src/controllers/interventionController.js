const pool = require('../config/db');
const bicycleController = require('./bicycleController');
const multer = require('multer');
const jwt = require('jsonwebtoken');

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

        const { repair, maintenance, operation, address } = JSON.parse(req.body.intervention);
        const userId = req.user.id;
        const photos = req.files;

        const isMaintenance = operation.operation === "maintenance";
        try {
            const bicycle = await bicycleController.save(req, res);
            
            const selectTechnicianQuery = "SELECT id FROM technician WHERE geographical_zone_id = $1 AND is_available = true LIMIT 1";
            const technicianResult = await pool.query(selectTechnicianQuery, [address.zone]);
            const technicianId = technicianResult.rows[0]?.id;
            
            const appointmentStart = isMaintenance ? maintenance.scheduleTimeStart : repair.scheduleTimeStart;
            const appointmentEnd = isMaintenance ? maintenance.scheduleTimeEnd : repair.scheduleTimeEnd;

            console.log("appointmentStart", appointmentStart);
            console.log("appointmentEnd", appointmentEnd);
            const description = isMaintenance ? "" : repair.issueDetails;
            const package = isMaintenance ? maintenance.package : "";
            
            const queryIntervention = 'INSERT INTO intervention (type, bicycle_id, technician_id, client_id, status, description, appointment_start, appointment_end, package) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';
            const result = await pool.query(queryIntervention, [operation.operation, bicycle.id, technicianId, userId, "", description, appointmentStart, appointmentEnd, package]);
            const intervention = result.rows[0];
            if (photos) {
                await uploadUserOperationPhotos(photos, intervention.id);
            }
            
            res.status(200).send({ success: true, message: "Intervention créée avec succès", data: intervention });
        } catch (error) {
            res.status(500).send({ success: false, message: "Erreur lors de la création de l'intervention", error: error.message });
        }
    });
}

const get = async (req, res) => {
    const query =
    `SELECT 
          intervention.*, 
          array_agg(intervention_bicycle_photos.file_path) as photos,
          array_agg(intervention_technician_photos.file_path) as technician_photos,
          json_agg(json_build_object('last_name', client.last_name, 'first_name', client.first_name, 'email', client.email, 'phone', client.phone, 'address', client.address)) as client_info
      FROM 
          intervention 
      LEFT JOIN 
          intervention_bicycle_photos ON intervention.id = intervention_bicycle_photos.intervention_id
      LEFT JOIN 
          intervention_technician_photos ON intervention.id = intervention_technician_photos.intervention_id  
      LEFT JOIN 
          client ON intervention.client_id = client.id
      GROUP BY 
          intervention.id
  `;
    const result = await pool.query(query);

    const data = result.rows.map(row => {
        return {
          ...row,
          photos: row.photos.filter(photo => photo !== null),
          technician_photos: row.technician_photos.filter(photo => photo !== null),
          client_info: row.client_info[0] // Assuming you want the first object in the array
        };
      });
    const id = result.rows.filter(row => row.photos?.length > 0 && row.photos[0] !== null);
    res.status(200).send({ success: true, message: "Interventions récupérées avec succès", data});
}


const uploadUserOperationPhotos = async (files,interventionId) => {
    return new Promise(async (resolve, reject) => {
        const query = 'INSERT INTO intervention_bicycle_photos (intervention_id, file_path) VALUES ($1, $2)';
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

const filePathIntervention = 'uploads/interventions/';

const storageIntervention = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, filePathIntervention);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

const uploadInterventionPhotos = multer({ 
    storage: storageIntervention 
}).fields([
    { name: 'interventionPhotos', maxCount: 10 },
    { name: 'intervention_id', maxCount: 1 },
    { name: 'is_canceled', maxCount: 1 },
    { name: 'comment', maxCount: 1 }
]);

const uploadTechnicianInterventionPhotos = async (files, interventionId) => {
    return new Promise(async (resolve, reject) => {
        const query = 'INSERT INTO intervention_technician_photos (intervention_id, file_path) VALUES ($1, $2)';
        
        try {
            for (const file of files) {
                const filePath = filePathIntervention + file.filename;
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

/**
 * Mettre à jour une intervention
 */
const manageEnd = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ success: false, message: "Token manquant" });
    }

    try {
        // const { role } = jwt.verify(token, process.env.JWT_SECRET);

        uploadInterventionPhotos(req, res, async (err) => {
            if (err) {
                return res.status(500).send({ success: false, message: "Erreur lors du téléchargement des photos", error: err });
            }

            const { intervention_id, is_canceled, comment } = req.body;
            const isCanceled = is_canceled === 'true';

            const photos = req.files['interventionPhotos'];
            try {
                const currentStatus = isCanceled ? "canceled" : "completed";
                console.log("currentStatus", currentStatus);
                // if(role === 'client'){
                //     await pool.query('DELETE FROM intervention WHERE id = $1',[intervention_id]);
                // }else{
                    await pool.query('UPDATE intervention SET status = $1, comment = $2 WHERE id = $3', [currentStatus, comment, intervention_id]);
                // }
                if (photos && photos.length > 0) {
                    await uploadTechnicianInterventionPhotos(photos, intervention_id);
                }
                res.status(200).send({ success: true, message: is_canceled ? "Intervention annulée" : "Intervention a été complétée" });
            } catch (error) {
                res.status(500).send({ success: false, message: "Erreur lors de l'annulation de l'intervention" });
            }
        });
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(401).send({ success: false, message: "Token invalide" });
    }
}

module.exports = {
    save,
    get,
    uploadUserOperationPhotos,
    manageEnd,
    uploadTechnicianInterventionPhotos
}   