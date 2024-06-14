const { faker } = require("@faker-js/faker");

faker.seed(42);

function createDataAdmin() {
  const username = faker.internet.userName();
  const password = "123";

  return {
    _id: username,
    username,
    password,
  };
}

function createRandomAccount() {
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const email = faker.internet.email({ firstName: username });
  const date_of_birth = faker.date.birthdate();
  const saldo = 0;
  const api_hit = 0;
  const nomor_telepon = faker.phone.number();

  return {
    _id: username,
    username,
    password,
    email,
    date_of_birth,
    saldo,
    api_hit,
    nomor_telepon,
  };
}

function createRandomAccounts(n) {
  const users = [];
  for (let i = 0; i < n; i++) {
    users.push(createRandomAccount());
  }
  return users;
}

function createDataAdmins(n) {
  const admins = [];
  for (let i = 0; i < n; i++) {
    admins.push(createDataAdmin());
  }
  return admins;
}

const { MongoClient } = require("mongodb");
const url =
  "mongodb+srv://hanvyhendrawan1105:lwxeC7fEfa7jgAH1@proyekws.ur2e8i2.mongodb.net/";
// 4 dan 6 itu menandakan kita mau pakai IPv4 atau IPv6
const client = new MongoClient(url, { family: 4 });
const dbName = "projectWS";

const main = async () => {
  try {
    await client.connect();
    const database = client.db(dbName);

    // const admins = createDataAdmins(4);
    const accounts = createRandomAccounts(5);

    // await database.collection("admin").insertMany(admins);
    await database.collection("users").insertMany(accounts);

    const query = { username: /ow/ };
    const projection = { _id: 1, username: 1, email: 1 };
    const options = { limit: 5, skip: 1 };

    const result = await database
      .collection("users")
      .find(query, { projection })
      .limit(options.limit)
      .skip(options.skip)
      .toArray();

    console.log(result);
    console.log("OK");
  } catch (error) {
    console.log(error);
  } finally {
    await client.close();
    process.exit(0); // Exit Node.js process
  }
};

main();
