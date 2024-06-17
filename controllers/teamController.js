const axios = require("axios");
const client = require("../config/config");

const addTeam = async (req, res) => {
  const { nickname, game } = req.query;
  const auth = req.header("Authorization");
  const accept = req.header("Accept");

  if (!auth || auth == "" || !accept || accept == "") {
    return res
      .status(401)
      .json({ message: "Authorization and Accept header is required!" });
  }

  if (!nickname || nickname == "" || !game || game == "") {
    return res.status(400).json({ error: "Nickname and game is required!" });
  }

  try {
    const result = await axios.get(
      `https://open.faceit.com/data/v4/search/teams?nickname=${nickname}&game=${game}&offset=0&limit=1`,
      {
        headers: {
          Authorization: auth,
          Accept: accept,
        },
      }
    );

    if (!result.data) {
      return res.status(404).json({ message: "Data's not found!" });
    }

    try {
      await client.connect();
      const db = client.db("projectWS");

      const findTeam = await db.collection("teams").findOne({ name: nickname });

      if (findTeam) {
        return res.status(400).json({ message: "Team has been added!" });
      }

      await db.collection("teams").insertOne({
        team_id: result.data.items[0].team_id,
        name: result.data.items[0].name,
        game: result.data.items[0].game,
        chat_room_id: result.data.items[0].chat_room_id,
        faceit_url: result.data.items[0].faceit_url,
      });

      return res.status(201).json({ message: "Success add team" });
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

const updateTeam = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const { name, game } = req.body;

    if (!name || !game || game == "" || name == "") {
      return res.status(400).json({ error: "Name and game are required" });
    }

    // Pengecekan apakah game sudah ada di database
    const existingGame = await db
      .collection("games")
      .findOne({ game_id: game });

    if (!existingGame) {
      return res.status(400).json({ error: "Game not found in database" });
    }

    const teamId = req.params.team_id;
    const existingTeam = await db
      .collection("teams")
      .findOne({ team_id: teamId });

    if (!existingTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    const updateData = {
      $set: {
        name,
        game,
      },
    };

    const updateResult = await db
      .collection("teams")
      .updateOne({ team_id: teamId }, updateData);

    if (updateResult.modifiedCount === 0) {
      return res.status(200).json({ message: "No changes made" });
    }

    return res.status(200).json({ message: "Team updated successfully" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const deleteTeam = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const teamId = req.params.team_id;

    if (!teamId || teamId == "") {
      return res.status(400).json({ message: "team_id is required" });
    }

    const deleteResult = await db
      .collection("teams")
      .deleteOne({ team_id: teamId });

    if (deleteResult.deletedCount === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    return res.status(200).json({ message: "Team deleted successfully" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const getTeam = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const teams = await db.collection("teams").find().toArray();

    if (!teams) {
      return res.status(404).json({ error: "Team not found" });
    }

    return res.status(200).json({ teams: teams });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

const favTeam = async (req, res) => {
  try {
    await client.connect();
    const db = client.db("projectWS");

    const teamId = req.params.team_id;

    if (!teamId || teamId == "") {
      return res.status(400).json({ message: "team_id is required" });
    }

    const team = await db.collection("teams").findOne({ team_id: teamId });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    const favorites = await db
      .collection("favorites")
      .findOne({ team_id: teamId });

    if (favorites) {
      // Remove team from wishlist
      await db.collection("favorites").deleteOne({ team_id: teamId });
      return res.status(200).json({ message: "Team removed from favorites" });
    }

    await db.collection("favorites").insertOne({
      team_id: team.team_id,
      name: team.name,
      game: team.game,
      chat_room_id: team.chat_room_id,
      faceit_url: team.faceit_url,
    });

    return res.status(201).json({ message: "Team added to favorites" });
  } catch (dbError) {
    console.error("Database error:", dbError);
    return res.status(500).json({ error: "Database error" });
  } finally {
    await client.close();
  }
};

module.exports = { addTeam, updateTeam, deleteTeam, getTeam, favTeam };
