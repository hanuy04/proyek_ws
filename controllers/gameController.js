const axios = require("axios");
const client = require("../config/config");

const addGame = async (req, res) => {
  const game_id = req.params.game_id;
  if (!game_id) {
    return res.status(400).json({ error: "Game ID is required" });
  }

  try {
    const result = await axios.get(
      `https://open.faceit.com/data/v4/games/${game_id}`,
      {
        headers: {
          Authorization: "Bearer 46fd3a8b-3414-4cbe-a35c-1281742fd74d",
          Accept: "application/json",
        },
      }
    );

    if (!result.data) {
      return res.status(404).json({ message: "Data's not found!" });
    }

    try {
      await client.connect();
      const db = client.db("projectWS");

      const findGame = await db.collection("games").findOne({ game_id });

      if (findGame) {
        return res.status(400).json({ message: "Game has been added!" });
      }

      await db.collection("games").insertOne({
        game_id: result.data.game_id,
        long_label: result.data.long_label,
        order: result.data.order,
        parent_game_id: result.data.parent_game_id,
        platforms: result.data.platforms,
        regions: result.data.regions,
      });

      return res.status(201).json({ message: "Success add game" });
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
};

const getGames = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const games = await db.collection("games").find().toArray();

    return res.status(200).json(games);
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const updateGames = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const gameId = req.params.game_id; // Ambil gameId dari URL parameter
    const game = await db.collection("games").findOne({ game_id: gameId });

    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }

    const { long_label, platforms, regions } = req.body;

    // Validasi field
    if (!long_label || !platforms || !regions) {
      return res.status(400).json({ error: "long_label, platforms, and regions are required" });
    }

    // Pastikan platforms dan regions berupa array
    const updatedPlatforms = Array.isArray(platforms) ? platforms : [platforms];
    const updatedRegions = Array.isArray(regions) ? regions : [regions];

    // Update data
    const updateResult = await db.collection("games").updateOne(
      { game_id: gameId },
      {
        $set: {
          long_label,
          platforms: updatedPlatforms,
          regions: updatedRegions,
        },
      }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(200).json({ message: "No changes made" });
    }

    return res.status(200).json({ message: "Game updated successfully" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};



module.exports = { addGame, getGames, updateGames };
