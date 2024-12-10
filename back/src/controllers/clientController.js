const pool = require('../config/db');

const getClients = async (req, res) => {
  const query = "SELECT * FROM client";
  try {
    const clients = await pool.query(query);
    res.status(200).json({ success: true, data: clients.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur lors de la récupération des clients" });
  }
};

const updateClient = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address } = req.body;

    console.log(firstName);
    console.log(lastName);
    console.log(email);
    console.log(phone);
    console.log(address);
    const query = "UPDATE client SET first_name = $1, last_name = $2, email = $3, phone = $4, address = $5 WHERE id = $6";
    try{
        await pool.query(query, [firstName, lastName, email, phone, address, id]);
        res.status(200).json({ success: true, message: "Client mis à jour avec succès" });
    }catch(error){
      if (error.code === '23505') { // PostgreSQL error code for unique violation
        res.status(400).send({ success: false, message: "Un client avec cette adresse email existe déjà" });
      } else {
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
      console.log(error);
        res.status(500).json({ success: false, message: "Erreur lors de la suppression des clients" });
    }
}
    
module.exports = {
    getClients,
    updateClient,
    deleteClient
};