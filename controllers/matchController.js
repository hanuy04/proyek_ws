const axios = require("axios");
const client = require("../config/config");

const addMatches = async (req, res) => {
  const { hub_name, game } = req.query;
  if (!hub_name) {
    return res.status(400).json({ error: "Hub name is required!" });
  }

  try {
    const findHub = await axios.get(
      `https://open.faceit.com/data/v4/search/hubs?name=${hub_name}&game=${game}&offset=0&limit=1`,
      {
        headers: {
          Authorization: "Bearer 46fd3a8b-3414-4cbe-a35c-1281742fd74d",
          Accept: "application/json",
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
            Authorization: "Bearer 46fd3a8b-3414-4cbe-a35c-1281742fd74d",
            Accept: "application/json",
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

module.exports = { addMatches };
