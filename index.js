const { MongoClient } = require("mongodb");

// untuk mendapat url > buka compass > klik ... di kiri atas > lalu tekan copy connection string
const url = "mongodb://localhost:27017";

// Family isinya 4 atau 6, untuk IPv4 atau IPv6
const client = new MongoClient(url, { family: 4 });

const dbName = "kuliah_ws_inf";

const main = async () => {
  try {
    await client.connect();
    // lakukan use kuliah_ws_inf
    const db = client.db(dbName);

    await db.dropDatabase();

    await db.createCollection("accounts");
    await db.createCollection("posts");

    const koleksiSaya = await db.collections();
    console.log(koleksiSaya.map((item) => item.collectionName));

    // untuk memanggil collection, di javascript panggil pakai function collection
    await db.collection("accounts").insertOne({
      _id: "lipsum",
      email: "lipsum@example.com",
      birthday: new Date("2000-06-25"),
    });

    // kalau di javascript kita ndak bisa pakai ISODate tapi pakai new Date
    await db.collection("accounts").insertMany([
      {
        _id: "lipsum2",
        email: "lipsum2@example.com",
        birthday: new Date("2002-02-22"),
      },
      { email: "mimi@gmail.com" },
      { birthday: new Date("2001-01-21") },
    ]);

    await db.collection("posts").insertOne({
      title: "Vicissitudo abduco",
      content: "Quae averto quos patria dicta fuga rerum.",
      createdAt: new Date("2023-06-18"),
      comments: [
        {
          content: "Cedo vapulus",
          createdAt: new Date("2023-08-08"),
          commenter: {
            _id: "lipsum",
            email: "lipsum@example.com",
          },
        },
        {
          content: "Supra vobis",
          createdAt: new Date("2023-08-08"),
          commenter: {
            _id: "dolorsit",
            email: "dolorsit@example.com",
          },
        },
      ],
      author: "lipsum",
      likes: ["lipsum", "dolorsit"],
    });

    const contohUpdate = await db
      .collection("accounts")
      .updateOne({ _id: "lipsum" }, { $set: { email: "testbaru@gmail.com" } });
    console.log(contohUpdate.modifiedCount);
  } catch (error) {
    console.log(error);
  } finally {
    // close connection
    await client.close();

    // kodingan ini supaya ketika kita node index.js, dia akan exit kalau sudah selesai
    process.exit(0);
  }
};

main();
