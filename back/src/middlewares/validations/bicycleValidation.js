const Joi = require('joi');

const bicycleSchema = Joi.object({
  brand: Joi.string()
    .required()
    .trim()
    .messages({
      "string.empty": "La marque est obligatoire",
      "any.required": "La marque est obligatoire"
    }),

  model: Joi.string()
    .required()
    .trim()
    .messages({
      "string.empty": "Le modèle est obligatoire",
      "any.required": "Le modèle est obligatoire"
    }),

  year: Joi.number()
    .integer()
    .min(1900)     
    .max(new Date().getFullYear()) 
    .required()
    .messages({
      "number.base": "L'année doit être un nombre",
      "number.empty": "L'année est obligatoire",
      "number.min": "L'année doit être supérieure ou égale à 1900",
      "number.max": `L'année ne peut pas être supérieure à ${new Date().getFullYear()}`,
      "any.required": "L'année est obligatoire"
    }),

  type: Joi.string()
    .required()
    .trim()
    .messages({
      "string.empty": "Le type est obligatoire",
      "any.required": "Le type est obligatoire"
    })
});

const validateBicycle = (req, res, next) => {
  const { error } = bicycleSchema.validate(req.body, { stripUnknown: true });
  
  if (error) {
    return res.status(400).send({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};

module.exports = { validateBicycle };