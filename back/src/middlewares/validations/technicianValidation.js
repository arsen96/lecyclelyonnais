const Joi = require('joi');

/**
 * Schéma pour la création d'un technicien
 */
const createTechnicianSchema = Joi.object({
  last_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .messages({
      "string.empty": "Le nom est obligatoire",
      "string.min": "Le nom doit contenir au moins 2 caractères",
      "any.required": "Le nom est obligatoire",
      "string.pattern.base": "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes"
    }),

  first_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .messages({
      "string.empty": "Le prénom est obligatoire",
      "string.min": "Le prénom doit contenir au moins 2 caractères",
      "any.required": "Le prénom est obligatoire",
      "string.pattern.base": "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes"
    }),

  email: Joi.string()
    .email()
    .max(254)
    .required()
    .lowercase()
    .messages({
      "string.empty": "L'email est obligatoire",
      "string.email": "Veuillez saisir un email valide",
      "any.required": "L'email est obligatoire"
    }),

  password: Joi.string()
    .min(8)
    .max(128)
    .optional()
    .allow('')
    .messages({
      "string.min": "Le mot de passe doit contenir au moins 8 caractères"
    }),

  phone: Joi.string()
    .pattern(/^[0-9+\s\-().]{6,20}$/)
    .required()
    .messages({
      "string.empty": "Le numéro de téléphone est obligatoire",
      "string.pattern.base": "Numéro de téléphone invalide"
    }),

  address: Joi.string()
    .max(500)
    .allow('', null)
    .messages({
      "string.max": "L'adresse ne peut pas dépasser 500 caractères"
    }),

  domain: Joi.string().min(2).max(100).required()
});

/**
 * Schéma pour la mise à jour d'un technicien
 * (password facultatif)
 */
const updateTechnicianSchema = createTechnicianSchema.keys({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "L'ID du technicien est obligatoire",
    "number.base": "L'ID doit être un entier positif"
  }),
  password: Joi.string().min(8).max(128).optional().allow('')
});

/**
 * Middlewares
 */
const validateCreateTechnician = (req, res, next) => {
  const { error } = createTechnicianSchema.validate(req.body, { stripUnknown: true });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

const validateUpdateTechnician = (req, res, next) => {
  const { error } = updateTechnicianSchema.validate(req.body, { stripUnknown: true });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = {
  validateCreateTechnician,
  validateUpdateTechnician,
};
