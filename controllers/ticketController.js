const client = require("../config/config");
const Joi = require("joi");

const addTicketSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.empty": "name is required!",
    "string.required": "name is required!",
  }),
  amount: Joi.number().min(0).required().messages({
    "string.empty": "Password is required!",
    "string.required": "Password is required!",
    "number.min": "Amount must be greater than 0!",
  }),
  price: Joi.number().min(0).required().messages({
    "string.empty": "price is required!",
    "string.required": "price is required!",
    "number.min": "price must be greater than 0!",
  }),
  match_id: Joi.string().required().messages({
    "string.empty": "match_id is required!",
    "string.required": "match_id is required!",
  }),
});

const addTicket = async (req, res) => {
  const { error } = addTicketSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  const { name, amount, price, match_id } = req.body;

  if (amount < 0 || price < 0) {
    return res
      .status(400)
      .json({ error: "Amount and price must be greater than 0!" });
  }

  try {
    await client.connect();
    const db = client.db("projectWS");

    const findTicket = await db.collection("tickets").findOne({ name: name });

    if (findTicket) {
      return res.status(400).json({ message: "Ticket has been added!" });
    }

    const findMatch = await db
      .collection("matches")
      .findOne({ match_id: match_id });

    if (!findMatch) {
      return res.status(404).json({ message: "Match's not found!" });
    }

    await db.collection("tickets").insertOne({
      name: name,
      amount: amount,
      price: price,
      match_id: findMatch.match_id,
      competition_name: findMatch.competition_name,
    });

    return res.status(201).json({ message: "Success add ticket" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const updateTicketSchema = Joi.object({
  new_name: Joi.string().required().messages({
    "string.empty": "new_name is required!",
    "string.required": "new_name is required!",
  }),
  amount: Joi.number().min(0).required().messages({
    "string.empty": "Amount is required!",
    "string.required": "Amount is required!",
    "number.min": "Amount must be greater than 0!",
  }),
  price: Joi.number().min(0).required().messages({
    "string.empty": "Price is required!",
    "string.required": "Price is required!",
    "number.min": "Price must be greater than 0!",
  }),
});

const updateTicket = async (req, res) => {
  const { error } = updateTicketSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ message: error.details[0].message });
  }

  const { new_name, amount, price } = req.body;
  const name = req.params.name;

  try {
    await client.connect();
    const db = client.db("projectWS");

    const findTicket = await db.collection("tickets").findOne({ name });

    if (!findTicket) {
      return res.status(404).json({ message: "Ticket not found!" });
    }

    const checkNewName = await db
      .collection("tickets")
      .findOne({ name: new_name });

    if (checkNewName && new_name !== name) {
      return res.status(400).json({ message: "New name already exists!" });
    }

    if (amount < 0 || price < 0) {
      return res
        .status(400)
        .json({ error: "Amount and price must be greater than 0!" });
    }

    const updateResult = await db.collection("tickets").updateOne(
      { name },
      {
        $set: {
          name: new_name,
          amount,
          price,
        },
      }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: "Failed to update ticket" });
    }

    return res.status(200).json({ message: "Ticket updated successfully" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const deleteTicket = async (req, res) => {
  const name = req.params.name;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    await client.connect();
    const db = client.db("projectWS");

    const findTicket = await db.collection("tickets").findOne({ name });

    if (!findTicket) {
      return res.status(404).json({ message: "Ticket not found!" });
    }

    const deleteResult = await db.collection("tickets").deleteOne({ name });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "Failed to delete ticket" });
    }

    return res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const seeTicket = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const userData = req.user;
    const user = await db
      .collection("users")
      .findOne({ username: userData.username });

    if (user.api_hit >= 2) {
      const sisaApi = user.api_hit - 2;
      const updateApi = await db
        .collection("users")
        .updateOne(
          { username: userData.username },
          { $set: { api_hit: sisaApi } }
        );

      const listTicket = await db.collection("tickets").find().toArray();

      return res.status(200).json(listTicket);
    } else {
      return res.status(400).json("API_Hit tidak mencukupi");
    }
  } catch (error) {}
};

module.exports = { addTicket, updateTicket, deleteTicket, seeTicket };
