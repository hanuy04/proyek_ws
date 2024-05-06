const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/getGames", async (req, res) => {
  const { offset, limit } = req.query;
  try {
    const result = await axios.get(
      `https://open.faceit.com/data/v4/games?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: "Bearer 46fd3a8b-3414-4cbe-a35c-1281742fd74d",
          Accept: "application/json",
        },
      }
    );

    return res.status(200).json({
      status: 200,
      body: {
        games: result.data.items.map((item) => {
          return {
            game_id: item.game_id,
            game_name_short: item.short_label,
            game_name_long: item.long_label,
            platforms: item.platforms,
            regions: item.regions,
            parent_game_id: item.parent_game_id,
            order: item.order,
          };
        }),
      },
    });
  } catch (error) {
    let newMsgError = error.toString().split(": ")[1];
    console.error("Error fetching data:", newMsgError);
    return res.status(500).json({ error: newMsgError });
  }
});

app.get("/getChampionships", async (req, res) => {
  const { offset, limit, game } = req.query;
  try {
    const result = await axios.get(
      `https://open.faceit.com/data/v4/championships?game=${game}&offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: "Bearer 46fd3a8b-3414-4cbe-a35c-1281742fd74d",
          Accept: "application/json",
        },
      }
    );

    return res.status(200).json({
      status: 200,
      body: {
        championship: result.data.items.map((item) => {
          return {
            championship_id: item.championship_id,
            current_subscriptions: item.current_subscriptions,
            description: item.description,
            game_id: item.game_id,
            region: item.region,
            slots: item.slots,
            status: item.status,
            total_groups: item.total_groups,
            total_prizes: "$" + item.total_prizes,
            total_rounds: item.total_rounds,
            type: item.type,
          };
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getLeaderboards/:championship_id", async (req, res) => {
  const { offset, limit } = req.query;
  const championship_id = req.params.championship_id;

  try {
    const result = await axios.get(
      `https://open.faceit.com/data/v4/leaderboards/championships/${championship_id}?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: "Bearer 46fd3a8b-3414-4cbe-a35c-1281742fd74d",
          Accept: "application/json",
        },
      }
    );

    return res.status(200).json({
      status: 200,
      body: {
        leaderboards: result.data.items.map((item) => {
          return {
            leaderboard_id: item.leaderboard_id,
            competition_id: item.competition_id,
            competition_type: item.competition_type,
            game_id: item.game_id,
            points_per_draw: item.points_per_draw,
            points_per_loss: item.points_per_loss,
            points_per_win: item.points_per_win,
            points_type: item.points_type,
            ranking_boost: item.ranking_boost,
            ranking_type: item.ranking_type,
            region: item.region,
            round: item.round,
            season: item.season,
            status: item.status,
          };
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getLeaderboardsPlayer/:leaderboard_id", async (req, res) => {
  const { offset, limit } = req.query;
  const leaderboard_id = req.params.leaderboard_id;

  try {
    const result = await axios.get(
      `https://open.faceit.com/data/v4/leaderboards/${leaderboard_id}?offset=${offset}&limit=${limit}`,
      {
        headers: {
          Authorization: "Bearer 46fd3a8b-3414-4cbe-a35c-1281742fd74d",
          Accept: "application/json",
        },
      }
    );

    return res.status(200).json({
      status: 200,
      body: {
        leaderboards: result.data.items.map((item) => {
          return {
            current_streak: item.current_streak,
            draw: item.draw,
            lost: item.lost,
            played: item.played,
            player: item.player,
          };
        }),
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getTournaments/:tournament_id", async (req, res) => {
  const tournament_id = req.params.tournament_id;
  const expanded = req.query;

  try {
    const result = await axios.get(
      `https://open.faceit.com/data/v4/tournaments/${tournament_id}?expanded=${expanded}`,
      {
        headers: {
          Authorization: "Bearer 46fd3a8b-3414-4cbe-a35c-1281742fd74d",
          Accept: "application/json",
        },
      }
    );

    return res.status(200).json({
      status: 200,
      body: {
        tournaments_name: result.data.items.name,
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({ error: error });
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
