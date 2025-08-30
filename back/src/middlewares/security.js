const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {
      message: 'Trop de tentatives de connexion, réessayez plus tard'
    },
    skipSuccessfulRequests: true, 
    trustProxy: true,
    standardHeaders: true,
    legacyHeaders: false
  });
  
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500, 
    message: {
        message: 'Trop de requêtes depuis votre IP, réessayez plus tard'
    },
    standardHeaders: true,
    legacyHeaders: false, 
  });

  // curl -i http://localhost:3000/api
  const helmetConfig = helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://www.lecyclelyonnais.fr", "https://test.lecyclelyonnais.fr"],
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