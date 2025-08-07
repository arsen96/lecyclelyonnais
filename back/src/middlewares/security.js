const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
// Securité pour l'authentification
const authLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 5, // 5 tentatives par IP toutes les x min
    message: {
      message: 'Trop de tentatives de connexion, réessayez plus tard'
    },
    skipSuccessfulRequests: true, 
  });
  
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Maximum 1000 requêtes par IP toutes les 15 min
    message: {
        message: 'Trop de requêtes depuis votre IP, réessayez plus tard'
    },
    standardHeaders: true, // Rate limit info dans les headers `RateLimit-*`
    legacyHeaders: false, // Désactive les headers `X-RateLimit-*`
  });

  // curl -i http://localhost:3000/api
  const helmetConfig = helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    }
  });



module.exports = {
    authLimiter,
    generalLimiter,
    helmetConfig
}