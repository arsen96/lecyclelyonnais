const pool = require('../config/db');
const bcrypt = require('bcrypt');

const getClients = async (req, res) => {
  const query = "SELECT * FROM client";
  try {
    const clients = await pool.query(query);
    res.status(200).json({ success: true, data: clients.rows });
  } catch (error) {
    console.log("Erreur lors de la récupération des clients", error);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des clients" });
  }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address, password } = req.body;

    let query = "UPDATE client SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5";
    const values = [firstName, lastName, email, phone, address];
    if (password?.length > 0) {
        const hashedPassword = await bcrypt.hash(password, 12);
        query += ", password = $6";
        values.push(hashedPassword);
    }

    query += " WHERE id = $" + (values.length + 1) + " RETURNING *";
    values.push(id);

    try {
        const result = await pool.query(query, values);
        res.status(200).json({ success: true, message: "Client mis à jour avec succès", data: result.rows[0] });
    } catch (error) {
        console.error("error", error);
        if (error.code === '23505') { // PostgreSQL error code for unique violation
          console.log("Erreur lors de la mise à jour du client", error);
            res.status(400).send({ success: false, message: "Un client avec cette adresse email existe déjà" });
        } else {
            console.log("Erreur lors de la mise à jour du client", error);
            res.status(500).send({ success: false, message: "Erreur lors de la mise à jour du client" });
        }
    }
}



const deleteClient = async (req, res) => {
  const { ids } = req.body;
    console.log("ids", ids);
    const query = "DELETE FROM client WHERE id = ANY($1::int[])";
    try {
        await pool.query(query, [ids]);
        res.status(200).json({ success: true, message: "Clients supprimés avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression des clients", error);
        res.status(500).json({ success: false, message: "Erreur lors de la suppression des clients" });
    }
}
    
module.exports = {
    getClients,
    updateClient,
    deleteClient
};