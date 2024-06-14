const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

// Middleware untuk memverifikasi token JWT
const verifyToken = (req, res, next) => {
  const token = req.header("x-api-key");
  if (!token) {
    return res.status(403).send({ message: "Token tidak disediakan" });
  }

  jwt.verify(token, JWT_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Token tidak valid" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = { verifyToken };
