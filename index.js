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
const putGameRoutes = require("./routes/gameRoutes");
app.use("", putGameRoutes);
const deleteGameRoutes = require("./routes/gameRoutes");
app.use("", deleteGameRoutes);

// team
const addTeamRoutes = require("./routes/teamRoutes");
app.use("", addTeamRoutes);
const getTeamRoutes = require("./routes/teamRoutes");
app.use("", getTeamRoutes);
const updateTeamRoutes = require("./routes/teamRoutes");
app.use("", updateTeamRoutes);
const deleteTeamRoutes = require("./routes/teamRoutes");
app.use("", deleteTeamRoutes);

// matches
const addMatchesRoutes = require("./routes/matchRoutes");
app.use("", addMatchesRoutes);
const getMatchesRoutes = require("./routes/matchRoutes");
app.use("", getMatchesRoutes);
const deleteMatchesRoutes = require("./routes/matchRoutes");
app.use("", deleteMatchesRoutes);

// ticket
const addTicketRoutes = require("./routes/ticketRoutes");
app.use("", addTicketRoutes);
const getTicketRoutes = require("./routes/ticketRoutes");
app.use("", getTicketRoutes);
const updateTicketRoutes = require("./routes/ticketRoutes");
app.use("", updateTicketRoutes);
const deleteTicketRoutes = require("./routes/ticketRoutes");
app.use("", deleteTicketRoutes);

// user
const blockUserRoutes = require("./routes/userRoutes");
app.use("", blockUserRoutes);
const deleteserRoutes = require("./routes/userRoutes");
app.use("", deleteserRoutes);
// ---------------------------------------- ADMIN-----------------------------------------

// ---------------------------------------- USER -----------------------------------------
// register
const registerRoutes = require("./routes/userRoutes");
app.use("", registerRoutes);

// update profile
const updateProfileRoutes = require("./routes/userRoutes");
app.use("", updateProfileRoutes);
// ---------------------------------------- USER -----------------------------------------
