const axios = require("axios");
const client = require("../config/config");

const addTeam = async (req, res) => {
  const { nickname, game } = req.query;
  if (!nickname) {
    return res.status(400).json({ error: "Nickname is required!" });
  }

  try {
    const result = await axios.get(
      `https://open.faceit.com/data/v4/search/teams?nickname=${nickname}&game=${game}&offset=0&limit=1`,
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

module.exports = { addTeam };
