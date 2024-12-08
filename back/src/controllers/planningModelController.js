const pool = require('../config/db');
const save = async (req, res) => {
    const query = 'INSERT INTO planning_models (name, intervention_type, slot_duration, start_time, end_time, available_days) VALUES ($1, $2, $3, $4, $5, $6)';
    
    // Ensure start_time and end_time are in the correct format
    const startTime = formatTime(req.body.start_time);

    console.log("startTime", startTime);
    const endTime = formatTime(req.body.end_time);
    const values = [req.body.name, req.body.intervention_type, req.body.slot_duration, startTime, endTime, req.body.available_days];
    
    try {
        await pool.query(query, values);
        res.status(200).json({ success: true, message: "Modèle de planning enregistré avec succès" });
    } catch (error) {
        console.log(error);
        console.log("req.body.start_time", req.body.start_time);
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
    const query = 'SELECT * FROM planning_models';
    const result = await pool.query(query);
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
    const query = 'DELETE FROM planning_models WHERE id = ANY($1)';
    await pool.query(query, [req.body.ids]);
    res.status(200).json({success:true,message:"Modèle de planning supprimé avec succès"});
}

module.exports = {
    save,
    get,
    update,
    deleteModel
}