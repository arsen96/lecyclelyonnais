const Joi = require('joi');

// Schéma pour création d'admin
const adminCreateSchema = Joi.object({
  first_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .messages({
      "string.empty": "Le prénom est obligatoire",
      "string.min": "Le prénom doit contenir au moins 2 caractères",
      "string.max": "Le prénom ne peut pas dépasser 100 caractères",
      "string.pattern.base": "Le prénom contient des caractères non autorisés",
      "any.required": "Le prénom est obligatoire"
    }),

  last_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .messages({
      "string.empty": "Le nom est obligatoire",
      "string.min": "Le nom doit contenir au moins 2 caractères",
      "string.max": "Le nom ne peut pas dépasser 100 caractères",
      "string.pattern.base": "Le nom contient des caractères non autorisés",
      "any.required": "Le nom est obligatoire"
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

  password: Joi.string()
    .min(6)
    .max(128)
    .required()
    .messages({
      "string.empty": "Le mot de passe est obligatoire",
      "string.min": "Le mot de passe doit contenir au moins 6 caractères",
      "string.max": "Le mot de passe ne peut pas dépasser 128 caractères",
      "any.required": "Le mot de passe est obligatoire"
    }),
  domain: Joi.string().allow(null, '').optional()
});

// Schéma pour mise à jour d'admin
const adminUpdateSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "L'ID doit être un nombre",
      "number.integer": "L'ID doit être un nombre entier",
      "number.positive": "L'ID doit être positif",
      "any.required": "L'ID est obligatoire"
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
      "string.max": "Le prénom ne peut pas dépasser 100 caractères",
      "string.pattern.base": "Le prénom contient des caractères non autorisés",
      "any.required": "Le prénom est obligatoire"
    }),

  last_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .trim()
    .pattern(/^[a-zA-ZÀ-ÿ\s\-']+$/)
    .messages({
      "string.empty": "Le nom est obligatoire",
      "string.min": "Le nom doit contenir au moins 2 caractères",
      "string.max": "Le nom ne peut pas dépasser 100 caractères",
      "string.pattern.base": "Le nom contient des caractères non autorisés",
      "any.required": "Le nom est obligatoire"
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

  password: Joi.string()
    .min(6)
    .max(128)
    .optional()
    .allow('')  // Permet un mot de passe vide pour ne pas le changer
    .messages({
      "string.min": "Le mot de passe doit contenir au moins 6 caractères",
      "string.max": "Le mot de passe ne peut pas dépasser 128 caractères"
    }),

});

// Schéma pour login
const adminLoginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "L'email est obligatoire",
      "string.email": "Veuillez saisir un email valide",
      "any.required": "L'email est obligatoire"
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Le mot de passe est obligatoire",
      "any.required": "Le mot de passe est obligatoire"
    }),
});

// Middlewares de validation
const validateAdminCreation = (req, res, next) => {
  const { error } = adminCreateSchema.validate(req.body, {
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

const validateAdminUpdate = (req, res, next) => {
  const { error } = adminUpdateSchema.validate(req.body, {
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

const validateAdminLogin = (req, res, next) => {
  const { error } = adminLoginSchema.validate(req.body, {
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
  validateAdminCreation,
  validateAdminUpdate,
  validateAdminLogin
};