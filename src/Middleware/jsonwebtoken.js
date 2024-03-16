const jwt = require('jsonwebtoken');
require('dotenv').config()

const secretKey = process.env.TOKEN_SECRET; // Use the same key used to sign the token

const verifyToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken
    if (!accessToken) {
        return res.status(401).json({ message: 'Token not provided' });
    }
    jwt.verify(accessToken, secretKey, (err, decoded) => {
        if (err) {
            console.log(err,"invalid token err");
            return res.status(401).json({ message: 'Token invalid or expired' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyToken
