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

// update profile

// ---------------------------------------- USER -----------------------------------------
