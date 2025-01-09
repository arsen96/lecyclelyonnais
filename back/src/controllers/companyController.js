const pool = require('../config/db');

const getCompanies = async (req, res) => {
  const {domain} = req.query;
  let result;
  if(domain){
    const companyId = await subdomainInfo(domain);
    const query = 'SELECT * FROM company WHERE id = $1';
    result = await pool.query(query,[companyId]);
  }else{
    const query = 'SELECT * FROM company';
    result = await pool.query(query);
  }
    
  try{
    res.status(200).send({ success: true, data: result.rows });
  }catch(error){
    console.error(error);
    res.status(500).send({ success: false, message: "Erreur lors de la récupération des entreprises" });
  }
};


const createCompany = async (req, res) => {
  try {
    const { name, email, subdomain, theme_color, phone } = req.body;
    const query = 'INSERT INTO company (name, email, subdomain, theme_color, phone) VALUES ($1, $2, $3, $4, $5)';
    await pool.query(query, [name, email, subdomain, theme_color, phone]);
    res.status(201).send({ success: true, message: "Entreprise créée avec succès" });
  } catch (error) {
    console.error(error);
    if(error.code === '23505'){
      res.status(400).send({ success: false, message: "Un sous-domaine est deja enregistré avec ce email" });
      return;
    }
    res.status(500).send({ success: false, message: "Erreur lors de la création de l'entreprise" });
  }
};

const subdomainInfo = async (subdomain) => {
  let result;
  if(!subdomain || subdomain == 'null'){
    const query = "SELECT id FROM company WHERE subdomain IS NULL";
    result = await pool.query(query);
  }else{
    const query = "SELECT id FROM company WHERE subdomain = $1";
    result = await pool.query(query, [subdomain]);
  }
  return result.rows[0]?.id ?? null;
}

const updateCompany = async (req, res) => {
  try {
    const { id, name, email, subdomain, theme_color, phone } = req.body;
    const query = 'UPDATE company SET name = $1, email = $2, subdomain = $3, theme_color = $4, phone = $5 WHERE id = $6';
    const result = await pool.query(query, [name, email, subdomain, theme_color, phone, id]);
    if (result.rowCount === 0) {
      return res.status(404).send({ success: false, message: "Entreprise non trouvée" });
    }
    res.status(200).send({ success: true, message: "Entreprise mise à jour avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Erreur lors de la mise à jour de l'entreprise" });
  }
};

const deleteCompanies = async (req, res) => {
  try {
    const { ids } = req.body;
    const deleteQuery = 'DELETE FROM company WHERE id = ANY($1::int[])';
    await pool.query(deleteQuery, [ids]);
    let message = ids.length > 1 ? "Les entreprises ont été supprimées" : "L'entreprise a été supprimée";
    res.status(200).json({ success: true, message });
  } catch (error) {
    if (error.code === '23503') {
      res.status(400).send({ success: false, message: "Cette entreprise est liée à une autre entité" });
      return;
    }
    console.error(error);
    res.status(500).send('Erreur lors de la suppression des entreprises');
  }
};

module.exports = { getCompanies, createCompany, updateCompany, deleteCompanies,subdomainInfo };
