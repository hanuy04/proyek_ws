const express = require("express");
const app = express();
require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(3000, () => console.log("Server up and running..."));

// LOGIN
const loginRoutes = require("./routes/loginRoutes");
app.use("", loginRoutes);

// ---------------------------------------- ADMIN-----------------------------------------
// game
const addGameRoutes = require("./routes/gameRoutes");
app.use("", addGameRoutes);
const getGameRoutes = require("./routes/gameRoutes");
app.use("", getGameRoutes);

// team
const addTeamRoutes = require("./routes/teamRoutes");
app.use("", addTeamRoutes);

// matches
const addMatchesRoutes = require("./routes/matchRoutes");
app.use("", addMatchesRoutes);
// ---------------------------------------- ADMIN-----------------------------------------
