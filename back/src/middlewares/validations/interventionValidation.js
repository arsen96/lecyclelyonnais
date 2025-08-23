const Joi = require("joi");

const interventionSchema = Joi.object({
  repair: Joi.object({
    scheduleTimeStart: Joi.date().iso(),
    scheduleTimeEnd: Joi.date().iso(),
    issueDetails: Joi.string().allow('')
  }),
  maintenance: Joi.object({
    scheduleTimeStart: Joi.date().iso(),
    scheduleTimeEnd: Joi.date().iso(),
    package: Joi.string().allow('')
  }),
  operation: Joi.object({
    operation: Joi.string().valid("repair", "maintenance").required()
  }).required(),
  address: Joi.object({
    zone: Joi.number().integer().positive().required()
  }).required()
});

const validateIntervention = (req, res, next) => {
  let body;
  try {
    body = JSON.parse(req.body.intervention);
  } catch (e) {
    return res.status(400).json({ success: false, message: "Format JSON invalide pour intervention" });
  }

  const { error } = interventionSchema.validate(body, { allowUnknown: true });
  if (error) {
    return res.status(400).json({ success: false, message: error.details[0].message });
  }

  next();
};

module.exports = { validateIntervention };