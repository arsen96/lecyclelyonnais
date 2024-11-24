const pool = require('../config/db'); 

const save = async (req, res) => {
    const { brand, model, year, type } = JSON.parse(req.body.intervention).details;

    console.log("brand", brand);
    console.log("model", model);
    console.log("year", year);
    console.log("type", type);
    
    const query = 'INSERT INTO bicycle (brand, model, c_year, type) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await pool.query(query, [brand, model, year, type]);

    return result.rows[0];
}  

const get = async (req, res) => {
    const query = 'SELECT * FROM bicycle';
    const result = await pool.query(query);
    res.status(200).send({ success: true, message: "Bicycles récupérés avec succès", data: result.rows });
}





module.exports = {
    save,
    get,
}
