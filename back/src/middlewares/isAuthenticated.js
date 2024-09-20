const jwt = require('jsonwebtoken');


const verifyToken = (req,res,next) => {
    const token = req.headers.authorization;
    if(!token){
      return res.status(401).json({
        success: false,
        message: 'invalidtoken',
      });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        next()
      } catch(err) {
        if (err.name === 'TokenExpiredError') {
          // Gère l'erreur d'expiration de token
          return res.status(401).json({
            success: false,
            message: 'invalidtoken',
          });
        }
    
        return res.status(401).json({
          success: false,
          message: 'invalidtoken',
        });
      }
}

module.exports = verifyToken;