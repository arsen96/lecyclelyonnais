const jwt = require('jsonwebtoken');


const verifyToken = (req,res,next) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log("tokentokentokentoken",token)
    if(!token){
      return res.status(401).json({
        success: false,
        message: 'invalidtoken',
      });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next()
      } catch(err) {
        console.log("errerrerr",err)
        if (err.name === 'TokenExpiredError') {
          // Gère l'erreur d'expiration de token
          return res.status(401).json({
            success: false,
            message: 'invalidtoken',
          });
        }
      }
}

module.exports = verifyToken;