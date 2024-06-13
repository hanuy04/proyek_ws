const { MongoClient } = require("mongodb");
const connectionString =
  "mongodb+srv://hanvyhendrawan1105:lwxeC7fEfa7jgAH1@proyekws.ur2e8i2.mongodb.net/";
const client = new MongoClient(connectionString, { family: 4 });
client.connect();
const db = client.db("projectWS");
module.exports = db;
console.log("You successfully connected to MongoDB!");
