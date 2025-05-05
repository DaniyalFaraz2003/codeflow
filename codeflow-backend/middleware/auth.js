const jwt = require('jsonwebtoken');
const User = require('../db/models/user');

const verifyToken = (req, res, next) => {
    const authheader = req.headers.authorization;
    const token = authheader && authheader.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Access Denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const isAuthenticated = async (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ message: 'Not authenticated' });
}

module.exports = {
    verifyToken,
    isAuthenticated
}