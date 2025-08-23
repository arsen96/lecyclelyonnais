const Joi = require('joi');

/**
 * Schéma Joi pour valider la création / mise à jour de zone
 */
const zoneSchema = Joi.object({
  wkt: Joi.string()
    .pattern(/^POLYGON\(\(.+\)\)$/i)
    .required()
    .messages({
      "string.empty": "La géométrie (wkt) est obligatoire",
      "any.required": "La géométrie (wkt) est obligatoire",
      "string.pattern.base": "Le champ wkt doit être un POLYGON valide"
    }),

  zoneTitle: Joi.string()
    .min(2)
    .max(150)
    .required()
    .trim()
    .messages({
      "string.empty": "Le nom de la zone est obligatoire",
      "string.min": "Le nom de la zone doit contenir au moins 2 caractères",
      "any.required": "Le nom de la zone est obligatoire"
    }),

  domain: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Le domaine est obligatoire",
      "any.required": "Le domaine est obligatoire"
    }),

  zoneTypeInterventionMaintenance: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "Le type d’intervention maintenance est obligatoire",
      "number.base": "Le type d’intervention maintenance doit être un entier positif"
    }),

  zoneTypeInterventionRepair: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "Le type d’intervention réparation est obligatoire",
      "number.base": "Le type d’intervention réparation doit être un entier positif"
    })
});

/**
 * Middleware de validation Joi
 */
const validateZone = (req, res, next) => {
  const { error } = zoneSchema.validate(req.body, { stripUnknown: true });

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

module.exports = { validateZone };
