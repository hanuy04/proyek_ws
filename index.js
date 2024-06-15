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
const gameRoutes = require("./routes/gameRoutes");
app.use("", gameRoutes);

// team

const teamRoutes = require("./routes/teamRoutes");
app.use("", teamRoutes);

// matches

const matchesRoutes = require("./routes/matchRoutes");
app.use("", matchesRoutes);

// ticket

const ticketRoutes = require("./routes/ticketRoutes");
app.use("", ticketRoutes);

// user
const userRoutes = require("./routes/userRoutes");
app.use("", userRoutes);

// ---------------------------------------- ADMIN-----------------------------------------

// ---------------------------------------- USER -----------------------------------------
// register
const registerRoutes = require("./routes/userRoutes");
app.use("", registerRoutes);

// get Team
const getTeamRoutes = require("./routes/teamRoutes");
app.use("", getTeamRoutes);

// get Detail Game
const getDetailGameRoutes = require("./routes/gameRoutes");
app.use("", getDetailGameRoutes);

// get Matches
const getMatchesRoutes = require("./routes/matchRoutes");
app.use("", getMatchesRoutes);

// get Detail Match
const getDetailMatchRoutes = require("./routes/matchRoutes");
app.use("", getDetailMatchRoutes);

// post Fav Teams
const favTeamsRoutes = require("./routes/teamRoutes");
app.use("", favTeamsRoutes);

// update profile

// ---------------------------------------- USER -----------------------------------------
