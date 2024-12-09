const jwt = require("jsonwebtoken");
const dbConfig = require("../database/db.config.js");

const JWT_SECRET = dbConfig.JWT_SECRET;

exports.authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
        return res.status(401).send({ message: "No autorizado. Token no proporcionado." });
    }

    const token = authHeader.split(" ")[1];
    if (!token || token.trim() === "") {
        return res.status(401).send({ message: "No autorizado. Token vacío o inválido." });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verifica el token
        req.user = decoded; // Adjuntar el usuario decodificado a `req`
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).send({ message: "No autorizado. Token expirado." });
        }
        return res.status(401).send({ message: "No autorizado. Token inválido." });
    }
};

exports.isAdminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).send({ message: "No autorizado. Solo los administradores pueden realizar esta acción." });
    }
    next();
};

exports.isModeratorMiddleware = (req, res, next) => {
    if (req.user.role !== "moderator") {
        return res.status(403).send({ message: "No autorizado. Solo los propietarios pueden realizar esta acción." });
    }
    next();
};


