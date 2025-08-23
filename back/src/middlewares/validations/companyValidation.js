const Joi = require('joi');

const companySchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100) // éviter les attaques DoS
    .required()
    .trim()
    .pattern(/^[a-zA-ZÀ-ÿ0-9\s\-'.,&]+$/) //caractères autorisés seulement
    .messages({
      "string.empty": "Le nom de l'entreprise est obligatoire",
      "string.min": "Le nom doit contenir au moins 2 caractères",
      "string.max": "Le nom ne peut pas dépasser 100 caractères",
      "string.pattern.base": "Le nom contient des caractères non autorisés",
      "any.required": "Le nom de l'entreprise est obligatoire"
    }),

  email: Joi.string()
    .email()
    .max(254)
    .required()
    .lowercase()
    .messages({
      "string.empty": "L'email est obligatoire",
      "string.email": "Veuillez saisir un email valide",
      "string.max": "L'email est trop long",
      "any.required": "L'email est obligatoire"
    }),

  subdomain: Joi.string()
    .min(3)
    .max(50)
    .alphanum()
    .required()
    .lowercase()
    .messages({
      "string.empty": "Le sous-domaine est obligatoire",
      "string.min": "Le sous-domaine doit contenir au moins 3 caractères",
      "string.max": "Le sous-domaine ne peut pas dépasser 50 caractères",
      "string.alphanum": "Le sous-domaine ne peut contenir que des lettres et chiffres",
      "any.required": "Le sous-domaine est obligatoire"
    }),

  theme_color: Joi.string()
    .pattern(/^#[0-9A-Fa-f]{6}$/) //format hexadécimal strict
    .required()
    .messages({
      "string.empty": "La couleur du thème est obligatoire",
      "string.pattern.base": "La couleur doit être au format hexadécimal (#RRGGBB)",
      "any.required": "La couleur du thème est obligatoire"
    }),

  phone: Joi.string()
    .pattern(/^[0-9\s]{10,14}$/)  
    .replace(/\s/g, '')           
    .pattern(/^[0-9]{10}$/)       
    .required()
    .messages({
      "string.empty": "Le numéro de téléphone est obligatoire",
      "string.pattern.base": "Le numéro de téléphone doit contenir exactement 10 chiffres",
      "any.required": "Le numéro de téléphone est obligatoire"
    })
});

const validateCompany = (req, res, next) => {
  const { error } = companySchema.validate(req.body, {
    stripUnknown: true
  });
  
  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};

module.exports = {
  validateCompany 
};