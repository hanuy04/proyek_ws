const client = require("../config/config");
const Joi = require("joi").extend(require("@joi/date"));

const deleteUser = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const username = req.body.username;

    if (username == "" || !username) {
      return res.status(400).json({ error: "Username is required!" });
    }

    const user = await db.collection("users").findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    await db.collection("users").deleteOne({ username: username });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const blockUser = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const username = req.body.username;

    if (username == "" || !username) {
      return res.status(400).json({ error: "Username is required!" });
    }

    const user = await db.collection("users").findOne({ username: username });

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    await db.collection("users").updateOne(
      { username: username },
      {
        $set: {
          status: "inactive",
        },
      }
    );

    return res.status(200).json({ message: "User blocked successfully" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const today = new Date();
const minDate = new Date(today.setFullYear(today.getFullYear() - 13));

const registerSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "username is required!",
    "string.required": "username is required!",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "password is required!",
    "string.required": "password is required!",
    "string.min": "password must be at least 8 characters!",
  }),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "email is required!",
      "string.required": "email is required!",
      "string.email": "email must be a valid email address!",
    }),
  date_of_birth: Joi.date()
    .format("DD/MM/YYYY")
    .less(minDate)
    .required()
    .messages({
      "string.empty": "date_of_birth is required!",
      "string.required": "date_of_birth is required!",
      "date.format": "date_of_birth must be in DD/MM/YYYY format!",
      "date.less": "date_of_birth must be at least 13 years old!",
    }),
  nomor_telepon: Joi.string().required().messages({
    "string.empty": "nomor_telepon is required!",
    "string.required": "nomor_telepon is required!",
  }),
});

const updateProfileSchema = Joi.object({
  new_username: Joi.string().required().messages({
    "string.empty": "new_username is required!",
    "string.required": "new_username is required!",
  }),
  new_password: Joi.string().min(8).required().messages({
    "string.empty": "new_password is required!",
    "string.required": "new_password is required!",
    "string.min": "new_password must be at least 8 characters!",
  }),
  new_email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .required()
    .messages({
      "string.empty": "new_email is required!",
      "string.required": "new_email is required!",
      "string.email": "new_email must be a valid email address!",
    }),
  new_date_of_birth: Joi.date()
    .format("DD/MM/YYYY")
    .less(minDate)
    .required()
    .messages({
      "string.empty": "new_date_of_birth is required!",
      "string.required": "new_date_of_birth is required!",
      "date.format": "new_date_of_birth must be in DD/MM/YYYY format!",
      "date.less": "new_date_of_birth must be at least 13 years old!",
    }),
  new_nomor_telepon: Joi.string().required().messages({
    "string.empty": "new_nomor_telepon is required!",
    "string.required": "new_nomor_telepon is required!",
  }),
});

const register = async (req, res) => {
  const { error } = registerSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    await client.connect();
    const db = client.db("projectWS");

    const { username, password, email, date_of_birth, nomor_telepon } =
      req.body;

    const user = await db.collection("users").findOne({ username: username });

    if (user) {
      return res.status(400).send({ message: "Username already registered!" });
    }

    await db.collection("users").insertOne({
      username: username,
      password: password,
      email: email,
      date_of_birth: date_of_birth,
      saldo: 0,
      api_hit: 0,
      nomor_telepon: nomor_telepon,
    });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const updateProfile = async (req, res) => {
  const { error } = updateProfileSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    await client.connect();
    const db = client.db("projectWS");

    const {
      new_username,
      new_password,
      new_email,
      new_date_of_birth,
      new_nomor_telepon,
    } = req.body;
    const username = req.params.username;

    if (!username || username == "") {
      return res.status(400).json({ message: "Username is required!" });
    }

    const user = await db.collection("users").findOne({ username: username });

    if (!user) {
      return res.status(400).json({ message: "User's not found!" });
    }

    const checkKembar = await db
      .collection("users")
      .findOne({ username: new_username });

    if (checkKembar && new_username != username) {
      return res.status(400).json({ message: "Username already registered!" });
    }

    await db.collection("users").updateOne(
      { username: username },
      {
        $set: {
          username: new_username,
          password: new_password,
          email: new_email,
          date_of_birth: new_date_of_birth,
          nomor_telepon: new_nomor_telepon,
        },
      }
    );

    return res
      .status(201)
      .json({ message: "User's profile updated successfully" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

module.exports = { deleteUser, blockUser, register, updateProfile };
