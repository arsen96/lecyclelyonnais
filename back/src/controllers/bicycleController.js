const pool = require('../config/db'); 

const save = async (req, res) => {
    const { brand, model, year, type } = JSON.parse(req.body.intervention).details;
    
    const query = 'INSERT INTO bicycle (brand, model, c_year, type) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [brand, model, year, type]);

    return result.rows[0];
}  

const get = async (req, res) => {
    const query = 'SELECT * FROM bicycle';
    const result = await pool.query(query);
    res.status(200).send({ success: true, message: "Bicycles récupérés avec succès", data: result.rows });
}


const addNew = async (req, res) => {
    const userId = req.user.id;
    const { brand, model, year, type } = req.body;
    const query = 'INSERT INTO bicycle (brand, model, c_year, type, client_id) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const result = await pool.query(query, [brand, model, year, type, userId]);
    res.status(200).send({ success: true, message: "Le vélo a bien été ajouté", data: result.rows[0] });
}

const getUserBicycles = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log("userIduserIduserIduserIduserId", userId);
        const query = 'SELECT * FROM bicycle WHERE client_id = $1';
        const result = await pool.query(query, [userId]);
        res.status(200).send({ success: true, message: "Vélos récupérés avec succès", data: result.rows });
    } catch (error) {
        console.error("Erreur lors de la récupération des vélos de l'utilisateur:", error);
        res.status(500).send({ success: false, message: "Erreur lors de la récupération des vélos" });
    }
}

const deleteBicycles = async (req, res) => {
    const { ids } = req.body;

    console.log("ids", ids);
    const query = 'DELETE FROM bicycle WHERE id = ANY($1::int[])';
    const result = await pool.query(query, [ids]);
    res.status(200).send({ success: true, message: "Vélos supprimés avec succès", data: result.rows });
}

const updateBicycle = async (req, res) => {
    const { id, brand, model, year, type } = req.body;

    const query = 'UPDATE bicycle SET brand = $2, model = $3, c_year = $4, type = $5 WHERE id = $1';
    const result = await pool.query(query, [id, brand, model, year, type]);
    res.status(200).send({ success: true, message: "Vélo mis à jour avec succès", data: result.rows[0] });
}

module.exports = {
    save,
    get,
    addNew,
    getUserBicycles,
    deleteBicycles,
    updateBicycle
}
