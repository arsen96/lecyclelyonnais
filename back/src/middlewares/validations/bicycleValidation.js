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

  year: Joi.string()
    .pattern(/^[0-9]{4}$/)
    .required()
    .messages({
      "string.empty": "L'année est obligatoire",
      "string.pattern.base": "L'année doit contenir exactement 4 chiffres",
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
  const { error } = bicycleSchema.validate(req.body, {
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

module.exports = { validateBicycle };