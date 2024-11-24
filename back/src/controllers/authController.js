const bcrypt = require('bcryptjs');
const pool = require('../config/db'); // Connexion à PostgreSQL via le pool
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require("nodemailer");

// Fonction pour générer un token JWT
const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

/**
 * Créer un nouveau client
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns obtenir le token de session
 */
const register = async (req, res) => {
  const { email, password,firstName,lastName,phone,address } = req.body;
  try {
    // Vérifier si l'utilisateur existe déjà dans la base de données
    const checkUserQuery = 'SELECT * FROM client WHERE email = $1';
    const result = await pool.query(checkUserQuery, [email]);

    if (result.rows.length > 0) {
      return res.status(400).json({ success: false, message: "L'adresse e-mail existe déjà" });
    }
    
    // Hasher le mot de passe avant de le sauvegarder
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log("hashedPassword",hashedPassword)
    const insertUserQuery = 'INSERT INTO client (first_name,last_name,email, password, phone, address) VALUES ($1, $2,$3, $4, $5, $6 ) RETURNING *';
    const newUser = await pool.query(insertUserQuery, [firstName,lastName,email, hashedPassword,phone,address]);
    console.log("newUser",newUser)
    const token = generateToken(newUser.rows[0]);
    res.status(201).json({
      success: true,
      token,
      data: {
        user: newUser.rows[0]  
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};



/**
 * Connecter un nouveau client
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns obtenir le token de session
 */
const login = async (req, res) => {
  const { email, password} = req.body;
  try {
    const checkUserQuery = 'SELECT * FROM client WHERE email = $1';
    const user = await pool.query(checkUserQuery, [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: "Ce mail n'existe pas" });
    }

    const currentUser = user.rows[0];
    const passwordExist = await bcrypt.compare(password,currentUser.password);
    if(!passwordExist){
      return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
    }
    const token = generateToken(currentUser);
    res.status(201).json({
      success: true,
      token,
      data: {
        user: currentUser  
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error });
  }
};

/**
 * Connecter un nouveau client
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns obtenir le token de session
 */
const oauth = async (req, res) => {
  const { email } = req.body;

  try {
    const checkUserQuery = 'SELECT email,password FROM client WHERE email = $1';
    const user = await pool.query(checkUserQuery, [email]);
   
    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: "L'utilisateur n'existe pas" });
    }

    const currentUser = user.rows[0];

    const token = generateToken(currentUser);
    // Retourner le token et l'utilisateur enregistré
    res.status(201).json({
      success: true,
      token,
      data: {
        user: currentUser
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: error });
  }
};


/**
 * Password forgot
 */

const passwordForgot = async (req, res) => {
  const { email } = req.body;
  const checkUserQuery = 'SELECT email,password FROM client WHERE email = $1';
  const user = await pool.query(checkUserQuery, [email]);
  if (user.rows.length > 0) {
    const currentUser = user.rows[0];
    const token = crypto.randomBytes(20).toString('hex');
    const date = new Date();
    date.setHours(date.getHours() + 1);

    await pool.query(`UPDATE client SET password_reset_token = $1,password_reset_token_expires = $2 WHERE email = $3 `, [token,date,currentUser.email]);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'kubatarsen@gmail.com',
        pass: 'qhoe nawk aecu dody',
      },
    });
    const mailOptions = {
      from: 'kubatarsen@gmail.com',
      to: email,
      subject: 'Réinitialisation du mot de passe',
      text: `Cliquer sur le lien pour réinitialiser votre mot de passe: http://localhost:8100/reset-password/${token}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).json({message: "Une erreur s'est produite lors de l'envoi d'email", success: false});
      } else {
        console.log(`Email sent: ${info.response}`);
        res.status(200).json({message : 'Vérifiez votre e-mail pour les instructions de réinitialisation de votre mot de passe.',success:true});
      }
    });
  } else {
    res.status(404).json({success:false,message:"L'adresse email n'a pas été trouvé"});
  }
};



const resetPassword = async (req, res) => {
  const { password,token } = req.body;
  const queryPasswordReset = await pool.query("SELECT * FROM client WHERE password_reset_token = $1 AND password_reset_token_expires > NOW()",[token]);
  // await pool.query("SELECT * FROM client WHERE password_reset_token = $1 AND password_reset_token WHERE now() < ")
  if(queryPasswordReset?.rows.length > 0){
    const user = queryPasswordReset.rows[0];
    const passwordHash = await bcrypt.hash(password,12)
    await pool.query("UPDATE client SET password = $1, password_reset_token_expires = NULL, password_reset_token = NULL WHERE email = $2",[passwordHash,user.email])
    res.status(200).json({message:"Votre mot de passe a été réinitialisé avec succès.", success: true})
  }else{
    res.status(500).json({message:"Le lien de réinitialisation du mot de passe est invalide ou a expiré.",success:false})
  }
};


const getConnectedUser = async (req, res) => {
  const token = req.headers.authorization
  if (!token) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    const userId = decoded.id;

    const userQuery = 'SELECT * FROM client WHERE id = $1';
    const userResult = await pool.query(userQuery, [userId]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
    }

    const user = userResult.rows[0];
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Erreur lors de la récupération de l'utilisateur" });
  }
};




module.exports = { register,login, oauth, passwordForgot,resetPassword,getConnectedUser };
