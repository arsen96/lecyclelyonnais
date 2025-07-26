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
        const query = 'SELECT * FROM bicycle WHERE client_id = $1';
        const result = await pool.query(query, [userId]);
        res.status(200).send({ success: true, message: "Vélos récupérés avec succès", data: result.rows });
    } catch (error) {
        console.error("Erreur lors de la récupération des vélos de l'utilisateur:", error);
        res.status(500).send({ success: false, message: "Erreur lors de la récupération des vélos" });
    }
}

const deleteBicycles = async (req, res) => {
    try {
        const { ids } = req.body;
        const userId = req.user.id; 
        
        // Vérifier d'abord quels vélos existent et appartiennent à l'utilisateur
        const checkQuery = 'SELECT id FROM bicycle WHERE id = ANY($1::int[]) AND client_id = $2';
        const existingBikes = await pool.query(checkQuery, [ids, userId]);
        
        if (existingBikes.rows.length === 0) {
            return res.status(404).send({ 
                success: false, 
                message: "Aucun vélo trouvé avec les IDs fournis ou vous n'avez pas les permissions" 
            });
        }

        // Supprimer seulement les vélos qui existent et appartiennent à l'utilisateur
        const deleteQuery = 'DELETE FROM bicycle WHERE id = ANY($1::int[]) AND client_id = $2 RETURNING id';
        const result = await pool.query(deleteQuery, [ids, userId]);
        
        if (result.rowCount === 0) {
            return res.status(404).send({ 
                success: false, 
                message: "Aucun vélo n'a pu être supprimé" 
            });
        }

        const deletedIds = result.rows.map(row => row.id);
        const notFoundIds = ids.filter(id => !deletedIds.includes(id));
        
        let message = `${result.rowCount} vélo(s) supprimé(s) avec succès`;
        if (notFoundIds.length > 0) {
            message += `. IDs non trouvés ou non autorisés: ${notFoundIds.join(', ')}`;
        }

        res.status(200).send({ 
            success: true, 
            message: message,
            data: {
                deletedIds: deletedIds,
                deletedCount: result.rowCount,
                notFoundIds: notFoundIds
            }
        });
        
    } catch (error) {
        console.error("Erreur lors de la suppression des vélos:", error);
        res.status(500).send({ 
            success: false, 
            message: "Erreur lors de la suppression des vélos" 
        });
    }
};

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
