const axios = require("axios");
const client = require("../config/config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const JWT_KEY = process.env.JWT_KEY;

const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required!",
    "string.required": "Username is required!",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required!",
    "string.required": "Password is required!",
  }),
});

const login = async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { username, password } = req.body;
  try {
    await client.connect();
    const db = client.db("projectWS");

    const admin = await db.collection("admin").findOne({ username: username });
    if (admin) {
      if (admin.password != password) {
        return res.status(400).json({ message: "Wrong password!" });
      }

      const token = jwt.sign(
        { username: admin.username, role: "admin" },
        JWT_KEY,
        {
          expiresIn: "3600s",
        }
      );

      return res.status(200).json({
        message: "Login admin success",
        token: token,
      });
    }

    const user = await db.collection("users").findOne({ username: username });
    if (!user) {
      return res.status(400).json({ message: "User is not registered!" });
    }

    if (user.password != password) {
      return res.status(400).json({ message: "Wrong password!" });
    }

    const token = jwt.sign({ username: user.username, role: "user" }, JWT_KEY, {
      expiresIn: "3600s",
    });

    res.status(200).json({
      message: "Login user success",
      token: token,
    });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

module.exports = { login };
