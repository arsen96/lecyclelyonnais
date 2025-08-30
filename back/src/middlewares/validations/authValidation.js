const Joi = require("joi");

// Schéma pour inscription (register)
const registerSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Le prénom est obligatoire",
    "string.min": "Le prénom doit contenir au moins 2 caractères"
  }),
  lastName: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Le nom est obligatoire",
    "string.min": "Le nom doit contenir au moins 2 caractères"
  }),
  email: Joi.string().email().max(254).required().messages({
    "string.email": "L'adresse email est invalide",
    "any.required": "L'email est obligatoire"
  }),
  password: Joi.string().min(6).max(128).required().messages({
    "string.min": "Le mot de passe doit contenir au moins 6 caractères",
    "any.required": "Le mot de passe est obligatoire"
  }),
  phone: Joi.string().pattern(/^[0-9]{10}$/).required().messages({
    "string.pattern.base": "Le téléphone doit contenir exactement 10 chiffres",
    "any.required": "Le téléphone est obligatoire"
  }),
  address: Joi.string().min(2).allow("", null),
  domain: Joi.string().allow(null, '').optional()
});

// Schéma pour login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "L'adresse email est invalide",
    "any.required": "L'email est obligatoire"
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Le mot de passe doit contenir au moins 6 caractères",
    "any.required": "Le mot de passe est obligatoire"
  }),
  domain: Joi.string().allow(null, '').optional()
});

// Schéma pour demande de reset password
const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  domain: Joi.string().allow(null, '').optional()
});

// Schéma pour reset password
const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).max(128).required(),
  token: Joi.string().required()
});


const validateRegister = (req, res, next) => {
    const { error } = registerSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
  };
  
  const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
  };
  
  const validateForgotPassword = (req, res, next) => {
    const { error } = forgotPasswordSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
  };
  
  const validateResetPassword = (req, res, next) => {
    const { error } = resetPasswordSchema.validate(req.body, { stripUnknown: true });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
  };
  
  module.exports = {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateResetPassword
  };
