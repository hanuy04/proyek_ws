const { number } = require("joi");
const client = require("../config/config");
const Joi = require("joi").extend(require("@joi/date"));
const multer = require("multer");
const upload = multer({ dest: "./upload" });
const fs = require("fs");
const path = require("path");
const { use } = require("../routes/ticketRoutes");

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

function getDate() {
  const today = new Date();

  // Get the individual components of the date
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(today.getDate()).padStart(2, "0");

  const formattedDate = `${month}/${day}/${year}`;

  return formattedDate;
}

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

const topUpSchema = Joi.object({
  saldo: Joi.number().min(1000).required().messages({
    "number.empty": "saldo is required!",
    "number.required": "saldo is required!",
    "number.min": "Minimal saldo is 1000",
  }),
});

const updatePassSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "email is required!",
    "string.required": "email is required!",
    "string.email": "email must be a valid email address!",
  }),
  newPassword: Joi.string().min(8).required().messages({
    "string.empty": "password is required!",
    "string.required": "password is required!",
    "string.min": "password must be at least 8 characters!",
  }),
});

const buyTicketSchema = Joi.object({
  ticket: Joi.string().required().messages({
    "string.empty": "ticket is required!",
    "string.required": "ticket is required!",
  }),
  amount: Joi.number().min(1).required().messages({
    "number.empty": "saldo is required!",
    "number.required": "saldo is required!",
    "number.min": "minimal ticket yang dibeli adalah 1",
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

const topUpUser = async (req, res) => {
  const { saldo } = req.body;
  const userData = req.user;

  const { error } = topUpSchema.validate(req.body);
  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  try {
    await client.connect();
    const db = client.db("projectWS");

    const user = await db
      .collection("users")
      .findOne({ username: userData.username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const totalSaldo = parseInt(saldo) + user.saldo;

    await db
      .collection("users")
      .updateOne({ username: user.username }, { $set: { saldo: totalSaldo } });

    return res.status(200).json({
      message: `Selamat, anda berhasil top up saldo sebanyak ${saldo}. Sekarang total saldo anda adalah ${totalSaldo}`,
    });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  } finally {
    await client.close();
  }
};

const forgetPassword = async (req, res) => {
  try {
    const { error } = updatePassSchema.validate(req.body);

    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    await client.connect();
    const db = client.db("projectWS");
    const userData = req.user;
    const { email, newPassword } = req.body;

    const user = await db
      .collection("users")
      .findOne({ username: userData.username });

    if (user.email == email) {
      const updatePassword = await db
        .collection("users")
        .updateOne(
          { username: userData.username },
          { $set: { password: newPassword } }
        );

      return res.status(200).json("Berhasil update password");
    } else {
      return res.status(400).json("Email tidak sesuai");
    }
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const buyApiHit = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");
    const userData = req.user;

    const user = await db
      .collection("users")
      .findOne({ username: userData.username });

    if (user.saldo >= 10000) {
      const totalApi = user.api_hit + 10;
      const totalSaldo = user.saldo - 10000;
      const updateuser = await db
        .collection("users")
        .updateOne(
          { username: userData.username },
          { $set: { api_hit: totalApi, saldo: totalSaldo } }
        );

      return res
        .status(200)
        .json(
          "Berhasil membeli api_hit, sekarang total saldo anda " +
            totalSaldo +
            " dan api_hit anda adalah " +
            totalApi
        );
    } else {
      return res.status(400).json("Saldo anda tidak cukup, silahkan topup");
    }
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const addPhotoProfile = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const userData = req.user;

    const extension = path.extname(req.file.originalname);
    const filename = `${userData.username}${extension}`;
    fs.renameSync(`./upload/${req.file.filename}`, `./upload/${filename}`);

    const file_path = `./upload/${filename}`;

    const addPhoto = await db
      .collection("users")
      .updateOne(
        { username: userData.username },
        { $set: { profile_pic: file_path } }
      );

    return res.status(201).json("Berhasil Upload profile picture");
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const updatePhotoProfile = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const userData = req.user;
    const user = await db
      .collection("users")
      .findOne({ username: userData.username });

    fs.unlinkSync(user.profile_pic);

    const extension = path.extname(req.file.originalname);
    const filename = `${userData.username}${extension}`;
    fs.renameSync(`./upload/${req.file.filename}`, `./upload/${filename}`);

    return res.status(200).json("Berhasil update Profile Picture");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const buyTicket = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const { error } = buyTicketSchema.validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const userData = req.user;
    const { ticket, amount } = req.body;

    const user = await db
      .collection("users")
      .findOne({ username: userData.username });

    const cekTicket = await db.collection("tickets").findOne({ name: ticket });

    if (cekTicket != null) {
      var totalHarga = parseInt(cekTicket.price) * parseInt(amount);
      if (user.saldo > totalHarga) {
        const dateToday = getDate();
        const sisaSaldo = user.saldo - totalHarga;
        const sisaTicket = parseInt(cekTicket.amount) - parseInt(amount);

        const newTransaction = await db.collection("transactions").insertOne({
          type: "Buy",
          username: user.username,
          ticket_name: cekTicket.name,
          amount: amount,
          date: dateToday,
        });

        const newInvoice = await db.collection("invoices").insertOne({
          type: "Buy",
          username: user.username,
          ticket: cekTicket.name,
          amount: amount,
          total: totalHarga,
          date: dateToday,
        });

        const updateUser = await db
          .collection("users")
          .updateOne(
            { username: user.username },
            { $set: { saldo: sisaSaldo } }
          );

        const userTicket = await db.collection("userTicket").insertOne({
          username: user.username,
          ticket: cekTicket.name,
          amount: amount,
        });

        const updateTicket = await db
          .collection("tickets")
          .updateOne({ name: ticket }, { $set: { amount: sisaTicket } });

        return res.status(200).json({
          type: "Buy",
          username: user.username,
          ticket_name: ticket.name,
          amount: amount,
          total: totalHarga,
          date: dateToday,
        });
      }
    } else {
      return res.status(404).json("Ticket tidak ditemukan");
    }
  } catch (error) {}
};

const cancelTicket = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const userData = req.user;
    const user = await db
      .collection("users")
      .findOne({ username: userData.username });

    const { ticket, amount } = req.body;

    const ticketData = await db.collection("tickets").findOne({ name: ticket });

    if (ticketData != null) {
      const cekUserTicket = await db
        .collection("userTicket")
        .findOne({ username: userData.username, ticket: ticket });

      if (cekUserTicket != null) {
        const sisaTicketUser =
          parseInt(cekUserTicket.amount) - parseInt(amount);
        const uangRefund = (parseInt(ticketData.price) * parseInt(amount)) / 2;
        const totalUangUser = user.saldo + uangRefund;
        const totalTicket = parseInt(ticketData.amount) + parseInt(amount);

        if (sisaTicketUser == 0) {
          const deleteUserTicket = await db
            .collection("userTicket")
            .deleteOne({ username: userData.username, ticket: ticket });

          const addInvoice = await db.collection("invoices").insertOne({
            type: "Cancel",
            username: userData.username,
            ticket_name: ticket,
            amount: amount,
            refund: uangRefund,
            date: getDate(),
          });

          const addTransaction = await db.collection("transactions").insertOne({
            type: "Cancel",
            username: userData.username,
            ticket_name: ticket,
            amount: amount,
            date: getDate(),
          });

          const updateUser = await db
            .collection("users")
            .updateOne(
              { username: user.username },
              { $set: { saldo: totalUangUser } }
            );

          const updateTicket = await db
            .collection("tickets")
            .updateOne({ name: ticket }, { $set: { amount: totalTicket } });
        } else {
          const updateUserTicket = await db
            .collection("userTicket")
            .updateOne(
              { username: user.username, ticket: ticket },
              { $set: { amount: sisaTicketUser } }
            );

          const addInvoice = await db.collection("invoices").insertOne({
            type: "Cancel",
            username: userData.username,
            ticket_name: ticket,
            amount: amount,
            refund: uangRefund,
            date: getDate(),
          });

          const addTransaction = await db.collection("transactions").insertOne({
            type: "Cancel",
            username: userData.username,
            ticket_name: ticket,
            amount: amount,
            date: getDate(),
          });

          const updateUser = await db
            .collection("users")
            .updateOne(
              { username: user.username },
              { $set: { saldo: totalUangUser } }
            );

          const updateTicket = await db
            .collection("tickets")
            .updateOne({ name: ticket }, { $set: { amount: totalTicket } });
        }
        return res.status(200).json({
          type: "Cancel",
          username: userData.username,
          ticket_name: ticket,
          amount: amount,
          refund: uangRefund,
          date: getDate(),
        });
      } else {
        return res.status(400).json("kamu tidak memiliki tiket tersebut");
      }
    } else {
      return res
        .status(404)
        .json("Ticket dengan nama tersebut tidak ditemukan");
    }
  } catch (error) {}
};

module.exports = {
  deleteUser,
  blockUser,
  register,
  updateProfile,
  topUpUser,
  buyApiHit,
  forgetPassword,
  addPhotoProfile,
  updatePhotoProfile,
  buyTicket,
  cancelTicket,
};
