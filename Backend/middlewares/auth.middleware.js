const jwt = require("jsonwebtoken");
require("dotenv").config();

const authmiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    try {
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded) {
            // Add user info to request
            req.user = {
                userId: decoded.userId,
                role: decoded.role,
                email: decoded.email
            };
            next();
        } else {
            return res.status(401).json({ message: "Invalid token" });
        }
    } catch (error) {
        res.status(401).json({ message: "Authentication failed", error: error.message });
    }
};

// Middleware to check if user is a dealer
const dealerAuth = async (req, res, next) => {
    try {
        if (req.user.role !== 'dealer') {
            return res.status(403).json({ message: "Access denied. Dealer privileges required." });
        }
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentication failed", error: error.message });
    }
};

module.exports = { authmiddleware, dealerAuth };