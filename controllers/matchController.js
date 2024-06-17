const axios = require("axios");
const client = require("../config/config");
const { get } = require("../routes/loginRoutes");

const addMatches = async (req, res) => {
  const { hub_name, game } = req.query;
  const auth = req.header("Authorization");
  const accept = req.header("Accept");

  if (!auth || auth == "" || !accept || accept == "") {
    return res
      .status(401)
      .json({ message: "Authorization and Accept header is required!" });
  }

  if (!hub_name || hub_name == "") {
    return res.status(400).json({ error: "Hub name is required!" });
  }

  try {
    const findHub = await axios.get(
      `https://open.faceit.com/data/v4/search/hubs?name=${hub_name}&game=${game}&offset=0&limit=1`,
      {
        headers: {
          Authorization: auth,
          Accept: accept,
        },
      }
    );

    if (!findHub) {
      return res.status(404).json({ message: "Data's not found!" });
    }

    try {
      const findMatches = await axios.get(
        `https://open.faceit.com/data/v4/hubs/${findHub.data.items[0].competition_id}/matches?offset=0&limit=5`,
        {
          headers: {
            Authorization: auth,
            Accept: accept,
          },
        }
      );

      if (!findMatches.data) {
        return res.status(404).json({ message: "Data's not found!" });
      }

      try {
        await client.connect();
        const db = client.db("projectWS");

        const findMatch = await db
          .collection("matches")
          .findOne({ competition_id: findHub.data.items[0].competition_id });

        if (findMatch) {
          return res.status(400).json({ message: "Match has been added!" });
        }

        await db
          .collection("matches")
          .insertMany([
            findMatches.data.items[0],
            findMatches.data.items[1],
            findMatches.data.items[2],
            findMatches.data.items[3],
            findMatches.data.items[4],
          ]);

        return res.status(201).json({ message: "Success add matches" });
      } catch (dbError) {
        console.error("Database error:", dbError);
        return res.status(500).json({ error: "Database error" });
      } finally {
        await client.close();
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      return res.status(500).json({ error: error.message });
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

const deleteMatches = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const match_id = req.params.match_id;

    if (!match_id || match_id == "") {
      return res.status(400).json({ error: "Match ID is required" });
    }

    // Cari pertandingan dengan match_id yang sesuai
    const match = await db
      .collection("matches")
      .findOne({ match_id: match_id });

    if (!match) {
      return res.status(404).json({ error: "Match not found" });
    }

    // Hapus pertandingan dari database
    const deleteResult = await db
      .collection("matches")
      .deleteOne({ match_id: match_id });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "Failed to delete match" });
    }

    return res.status(200).json({ message: "Match deleted successfully" });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
};

const getMatches = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const matches = await db.collection("matches").find().toArray();

    return res.status(200).json(matches);
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const getDetailMatch = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const match_id = req.params.match_id;

    if (!match_id || match_id == "") {
      return res.status(400).json({ error: "Match ID is required" });
    }

    const tickets = await db
      .collection("tickets")
      .findOne({ match_id: match_id });

    if (!tickets) {
      return res.status(404).json({ error: "Tickets not found" });
    }

    const ticketsLeft = tickets.filter((ticket) => !ticket.sold);

    return res.status(200).json({ tickets_left: ticketsLeft.length });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await client.close();
  }
};

module.exports = { addMatches, deleteMatches, getMatches, getDetailMatch };
