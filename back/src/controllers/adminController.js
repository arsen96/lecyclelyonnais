const bcrypt = require('bcrypt');
const pool = require("../config/db");
const jwt = require('jsonwebtoken');
const generateToken = (user) => {

  console.log("useruser", user);
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const getAdmins = async (req, res) => {
    const query = "SELECT * FROM administrator";
    try {
        const admins = await pool.query(query);
        res.status(200).json({success: true, data: admins.rows});
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ success: false, message: "Erreur lors de la récupération des admins" });
    }
}

const createAdmin = async (req, res) => {
    const { first_name, last_name, email, password, role } = req.body;
    try {
        // Vérifier si l'email existe déjà dans les tables administrator, technician, ou client
        const checkEmailQuery = `
            SELECT * FROM (
                SELECT email FROM administrator
                UNION
                SELECT email FROM technician
                UNION
                SELECT email FROM client
            ) AS all_emails WHERE email = $1
        `;


        const emailResult = await pool.query(checkEmailQuery, [email]);
        console.log("emailResult", emailResult.rows);
        if (emailResult.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Un utilisateur avec cet email existe déjà" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const query = "INSERT INTO administrator (first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5)";
        await pool.query(query, [first_name, last_name, email, hashedPassword, 'admin']);
        res.status(200).json({ success: true, message: "Admin créé avec succès" });
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ success: false, message: "Erreur lors de la création de l'admin" });
    }
}

const updateAdmin = async (req, res) => {   
    const { id, first_name, last_name, email, password, role } = req.body;
    try {
        // Vérifier si l'email existe déjà pour un autre utilisateur dans les tables administrator, technician, ou client
        const checkEmailQuery = `
            SELECT * FROM (
                SELECT email FROM administrator WHERE id != $2
                UNION
                SELECT email FROM technician
                UNION
                SELECT email FROM client
            ) AS all_emails WHERE email = $1
        `;
        const emailResult = await pool.query(checkEmailQuery, [email, id]);
        if (emailResult.rows.length > 0) {
            return res.status(400).json({ success: false, message: "Un autre utilisateur avec cet email existe déjà" });
        }

        let query, params;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = "UPDATE administrator SET first_name = $1, last_name = $2, email = $3, password = $4, role = $5 WHERE id = $6";
            params = [first_name, last_name, email, hashedPassword, role, id];
        } else {
            query = "UPDATE administrator SET first_name = $1, last_name = $2, email = $3, role = $4 WHERE id = $5";
            params = [first_name, last_name, email, role, id];
        }
        await pool.query(query, params);
        res.status(200).json({ success: true, message: "Admin mis à jour avec succès" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la mise à jour de l'admin" });
    }
}

const deleteAdmin = async (req, res) => {
    const { ids } = req.body;
    const query = "DELETE FROM administrator WHERE id = ANY($1::int[])";
    try {
        await pool.query(query, [ids]);
        res.status(200).json({ success: true, message: "Admins supprimés avec succès" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur lors de la suppression des admins" });
    }
}

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = "SELECT * FROM administrator WHERE email = $1";
    const result = await pool.query(query, [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }
    const admin = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Mot de passe incorrect" });
    }
    const token = generateToken(admin);
    console.log("token", token);
    res.status(200).json(
        { success: true, message: "Connexion réussie", token, data: {  user: { ...admin, role: admin.role ? 'admin' : 'superadmin' } } });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: "Erreur lors de la connexion" });
  }
};

module.exports = { getAdmins, createAdmin, updateAdmin, deleteAdmin, loginAdmin }; 