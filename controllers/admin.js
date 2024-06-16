const client = require("../config/config");

const getAllInvoice = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const userData = req.user;

    const cekUser = await db
      .collection("admin")
      .findOne({ username: userData.username });

    if (cekUser != null) {
      const listInvoice = await db.collection("invoices").find().toArray();

      return res.status(200).json(listInvoice);
    } else {
      return res.status(400).json({ message: "Anda bukan admin" });
    }
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const getOneUserInvoice = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const userData = req.user;
    const username = req.params.username;

    const cekAdmin = await db
      .collection("admin")
      .findOne({ username: userData.username });

    if (cekAdmin != null) {
      const cekUser = await db
        .collection("users")
        .findOne({ username: username });

      if (cekUser != null) {
        const listInvoice = await db
          .collection("invoices")
          .find({ username: username })
          .toArray();

        return res.status(200).json(listInvoice);
      } else {
        return res
          .status(404)
          .json({ message: "user dengan username tersebut tidak ditemukan" });
      }
    } else {
      return res.status(400).json({ message: "Anda bukan admin" });
    }
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const getAllTransaction = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const userData = req.user;

    const cekUser = await db
      .collection("admin")
      .findOne({ username: userData.username });

    if (cekUser != null) {
      const listTransaction = await db
        .collection("transactions")
        .find()
        .toArray();

      return res.status(200).json(listTransaction);
    } else {
      return res.status(400).json({ message: "Anda bukan admin" });
    }
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const getOneUserTransaction = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const userData = req.user;
    const username = req.params.username;

    const cekAdmin = await db
      .collection("admin")
      .findOne({ username: userData.username });

    if (cekAdmin != null) {
      const cekUser = await db
        .collection("users")
        .findOne({ username: username });

      if (cekUser != null) {
        const listTransaction = await db
          .collection("transactions")
          .find({ username: username })
          .toArray();

        return res.status(200).json(listTransaction);
      } else {
        return res
          .status(404)
          .json({ message: "user dengan username tersebut tidak ditemukan" });
      }
    } else {
      return res.status(400).json({ message: "Anda bukan admin" });
    }
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

module.exports = {
  getAllInvoice,
  getOneUserInvoice,
  getAllTransaction,
  getOneUserTransaction,
};
