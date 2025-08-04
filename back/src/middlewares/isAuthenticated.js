const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'invalidtoken',
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log("errerrerr", err);
        
        // Gère TOUTES les erreurs JWT (expiration, invalid, etc.)
        return res.status(401).json({
            success: false,
            message: 'invalidtoken',
        });
    }
}

module.exports = verifyToken;