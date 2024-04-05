const jwt = require('jsonwebtoken');
const jwtSecretKey = 'your_jwt_secret_key';

function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
  
    if (!token) {
      return res.status(401).send('Unauthorized: No token provided');
    }
  
    jwt.verify(token, jwtSecretKey, (err, decoded) => {
      if (err) {
        return res.status(403).send('Unauthorized: Invalid token');
      }
  
      req.username = decoded.username;
      next();
    });
}

module.exports = verifyToken;
