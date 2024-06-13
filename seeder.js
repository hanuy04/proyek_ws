/**
 * Dokumentasi faker
 * https://fakerjs.dev/api/
 */

const { faker } = require("@faker-js/faker");

faker.seed(42);

function createRandomAccount() {
  const sex = faker.person.sexType();
  const firstName = faker.person.firstName(sex);
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const username = faker.internet.userName({ firstName, lastName });

  return {
    _id: username,
    avatar: faker.image.avatar(),
    birthday: faker.date.birthdate(),
    email,
    fullName: `${firstName} ${lastName}`,
    gender: sex,
  };
}

function createRandomAccounts(n) {
  const users = [];
  for (let i = 0; i < n; i++) {
    users.push(createRandomAccount());
  }
  return users;
}

function createRandomPost() {
  const n = faker.number.int({ min: 0, max: 10 });
  const comments = [];
  const postDate = faker.date.recent({ days: 365 });
  for (let i = 0; i < n; i++) {
    comments.push({
      content: faker.lorem.sentence(),
      createdAt: faker.date.soon({ days: 100, refDate: postDate }),
    });
  }
  return {
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraph(),
    createdAt: postDate,
    comments: comments,
  };
}

function createRandomPosts(n, accounts) {
  const posts = [];
  const usernames = accounts.map((a) => a._id);
  const accountsSmall = accounts.map((a) => ({
    _id: a._id,
    avatar: a.avatar,
  }));
  for (let i = 0; i < n; i++) {
    const post = createRandomPost();
    post.author = faker.helpers.arrayElement(usernames);
    post.likes = faker.helpers.arrayElements(
      usernames,
      faker.number.int({ min: 0, max: 10 })
    );
    for (let j = 0; j < post.comments.length; j++) {
      post.comments[j].commenter = faker.helpers.arrayElement(accountsSmall);
    }
    posts.push(post);
  }
  return posts;
}

const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
// 4 dan 6 itu menandakan kita mau pakai IPv4 atau IPv6
const client = new MongoClient(url, { family: 4 });
const dbName = "kuliah_ws_inf";

const main = async () => {
  try {
    await client.connect();
    const database = client.db(dbName);

    const accounts = createRandomAccounts(10);
    const posts = createRandomPosts(50, accounts);

    await database.dropDatabase();
    await database.collection("accounts").insertMany(accounts);
    await database.collection("posts").insertMany(posts);

    const query = { fullName: /ow/ };
    const projection = { _id: 1, avatar: 1 };
    const options = { limit: 5, skip: 1 };

    const result = await database
      .collection("accounts")
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
