# MongoDB

---

## MongoDB

> MongoDB is a general-purpose, feature-rich, and powerful document-based NoSQL database that provides efficient and flexible storage for a variety of different types of data sets.

---

## Perbandingan MongoDB dengan SQL biasa

| SQL      | MongoDB    |
| -------- | ---------- |
| database | database   |
| table    | collection |
| row      | document   |

---

## MongoDB + NodeJs

- Untuk membuat aplikasi JavaScript yang bisa terkoneksi dengan database MongoDB, dapat digunakan [MongoDB Node.js Driver](https://www.npmjs.com/package/mongodb)
- Installasi: `npm install mongodb`
- Untuk membuat model (ODM) dapat digunakan [mongoose](https://www.npmjs.com/package/mongoose) (Minggu depan)

---

### Contoh web service read data

```js [1-27|5-9|12-18|21-27]
// import express
const express = require("express");
const app = express();

// import library dan setting koneksi ke mongodb
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "wsinf20232m09";

app.get("/api/posts/", async function (req, res) {
  // contoh query
  const posts = await client.db(dbName).collection("posts").find().toArray();
  return res.status(200).send(posts);
});

// connect ke mongodb (connect bersifat asynchronous)
client.connect().then(function () {
  const port = 3000;
  app.listen(port, function () {
    console.log(`listening on port ${port}`);
  });
});
```

---

## DDL

---

### database (mongosh)

```js
// melihat semua database yang ada
show dbs
// memilih database
use nama_database
// membuat database baru:
//   1. gunakan use <nama database baru>
//   2. tambah collection atau dokumen ke database tersebut
use database_baru
db.createCollection("<nama_collection>")
// hapus database
db.dropDatabase()
```

---

### database (JavaScript)

```js
// memilih database
await client.db("<nama_database>");
// membuat database baru:
//   1. pilih database
//   2. tambah collection atau dokumen ke database tersebut
await client
  .db("<nama_database_baru>")
  .createCollection("<nama_collection_baru>");
// hapus database
await client.db("<nama_database>").dropDatabase();
```

---

### Collection (mongosh)

```js
// list semua collection dalam db
db.getCollectionNames()
// create collection
//   cara 1:
db.createCollection("<nama_collection>")
//   cara 2: tambahkan sebuah dokumen baru ke
//   collection tersebut
db.nama_collection.insertOne({...})
// delete collection
db.nama_collection.drop()
```

---

### Collection (JavaScript)

```js [1-13|14-17]
// list semua collection dalam db
let collections = await client.db("<nama_database>").collections();
console.log(collections.map((c) => c.collectionName));
// create collection
//   cara 1:
await client.db("<nama_database>").createCollection("<nama_collection>");
//   cara 2: tambahkan sebuah dokumen baru ke
//   collection tersebut
await client.db("<nama_database>").collection("<nama_collection>").insertOne({
  /* ... */
});
// delete collection
await client.db("<nama_database>").collection("<nama_collection>").drop();
```

---

### Schema Validation

- Di MongoDB data bersifat unstructured. Jadi attributenya bebas seperti object javascript
- Namun kadang-kadang ada attribute yang perlu pengecekan, misalnya ada attribute yang wajib ada, attribute yang tipe datanya harus angka, dll
- Pada collection bisa ditambahkan schema validation. Schema validation mengecek dokumen ketika insert dan update document
- Schema validation tidak mengecek data yang sudah ada di collection sebelum validation dibuat

---

### Contoh Schema Validation (mongosh)

```js
db.createCollection("students", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      title: "Student Object Validation",
      required: ["address", "major", "name", "year"],
      properties: {
        name: {
          bsonType: "string",
          description: "'name' must be a string and is required",
        },
        year: {
          bsonType: "int",
          minimum: 2017,
          maximum: 3017,
          description:
            "'year' must be an integer in [ 2017, 3017 ] and is required",
        },
        gpa: {
          bsonType: ["double", "int"],
          description: "'gpa' must be a double or int if the field exists",
        },
        grade: {
          enum: ["A", "B", "C"],
          description: "Must be either A, B, or C",
        },
        courses: {
          bsonType: "array",
          items: { bsonType: "string" },
          description:
            "'courses' must be an array of strings if the field exists",
        },
      },
    },
  },
});
```

---

### Update Schema Validation (mongosh)

```js
db.runCommand({
  collMod: "<collection>",
  validator: {
    $jsonSchema: {
      // mirip seperti slide sebelumnya
    },
  },
});
```

Untuk daftar attribute `$jsonSchema` dapat dilihat di [sini](https://www.mongodb.com/docs/manual/reference/operator/query/jsonSchema/)

---

### Index

- Index membantu mempercepat pengaksesan data
- Index disimpan dalam bentuk B-tree

---

### Contoh pembuatan index (mongosh)

```js
// single index
db.nama_collection.createIndex({ name: 1 });
// compound index
db.nama_collection.createIndex({ name: 1, gpa: -1 });
// unique index
db.nama_collection.createIndex({ email: 1 }, { unique: true });
// compound unique index
db.nama_collection.createIndex(
  { groupNumber: -1, lastname: 1, firstname: 1 },
  { unique: true }
);
```

Catatan: angka 1 atau -1 menandakan indeks disortir secara ascending atau descending

---

### Pembuatan index (JavaScript)

```js
await client
  .db("<nama_database>")
  .collection("<nama_collection>")
  .createIndex(/* ... */);
```

Mirip dengan mongosh. Hanya berbeda di bagian depan.

---

## DML

---

### Insert

```js
// mongosh
db.nama_collection.insertOne({
  /* ... */
});
db.nama_collection.insertMany([
  {
    /* ... */
  },
  {
    /* ... */
  } /* ... */,
]);
// JavaScript
await client.db("<nama_database>").collection("<nama_collection>").insertOne({
  /* ... */
});
await client.db("<nama_database>").collection("<nama_collection>").insertMany([
  {
    /* ... */
  },
  {
    /* ... */
  } /* ... */,
]);
```

---

### \_id

- setiap document memiliki primary key bernama \_id
- field \_id bisa diisi manual oleh user
- jika tidak diisi, mongodb akan aotomatis membuatkan id dalam bentuk ObjectID

---

### [Embedded Document](https://www.mongodb.com/basics/embedded-mongodb)

- Sebuah document pada MongoDB berbentuk JSON, sehingga sebuah document dapat memiliki array atau document lain. Hal ini menyebabkan desain database pada MongoDB berbeda dengan desain database relational
- Pada database relational, tabel didesain berdasarkan entity agar data konsisten dan tidak duplikat
- Pada database NoSQL document based, collection didesain berdasarkan data apa saja yang sering diakses

---

### update

```js
// mongosh
db.nama_collection.updateOne(
  {
    /* where */
  },
  {
    /* update */
  }
);
db.nama_collection.updateMany(
  {
    /* where */
  },
  {
    /* update */
  }
);
// JavaScript
await client.db("<nama_database>").collection("<nama_collection>").updateOne(
  {
    /* where */
  },
  {
    /* update */
  }
);
await client.db("<nama_database>").collection("<nama_collection>").updateMany(
  {
    /* where */
  },
  {
    /* update */
  }
);
```

Baca juga: [Query & projection operator](https://www.mongodb.com/docs/manual/reference/operator/query/) untuk digunakan di bagian where dan [Update operator](https://www.mongodb.com/docs/manual/reference/operator/update/) untuk digunakan di bagian update

---

#### Contoh Comparison

```js
db.coll.find({ year: { $gt: 1970 } });
db.coll.find({ year: { $gte: 1970 } });
db.coll.find({ year: { $lt: 1970 } });
db.coll.find({ year: { $lte: 1970 } });
db.coll.find({ year: { $ne: 1970 } });
db.coll.find({ year: { $in: [1958, 1959] } });
db.coll.find({ year: { $nin: [1958, 1959] } });
// untuk operasi "like" digunakan regex
// mongosh
db.coll.find({ name: /a/ });
// javascript
await client
  .db("<nama_database>")
  .collection("<nama_collection>")
  .find({ name: new RegExp("a") })
  .toArray();
```

---

#### Logical

```js
db.coll.find({ name: { $not: { $eq: "Max" } } });
db.coll.find({ $or: [{ year: 1958 }, { year: 1959 }] });
db.coll.find({ $nor: [{ price: 1.99 }, { sale: true }] });
db.coll.find({
  $and: [
    { $or: [{ qty: { $lt: 10 } }, { qty: { $gt: 50 } }] },
    { $or: [{ sale: true }, { price: { $lt: 5 } }] },
  ],
});
```

---

### [Dot notation](https://www.mongodb.com/docs/manual/core/document/#dot-notation)

- Untuk mengakses field pada embedded document atau mengakses array indeks tertentu, gunakan dot notation
- Untuk update isi array dapat menggunakan bantuan operator [`$[]`](https://www.mongodb.com/docs/manual/reference/operator/update/positional-all/#mongodb-update-up.---) dan [`$[<identifier>]`](https://www.mongodb.com/docs/manual/reference/operator/update/positional-filtered/#mongodb-update-up.---identifier--)

---

### delete

```js
// mongosh
db.nama_collection.deleteOne({
  /* where */
});
db.nama_collection.deleteMany({
  /* where */
});
// JavaScript
await client.db("<nama_database>").collection("<nama_collection>").updateOne({
  /* where */
});
await client.db("<nama_database>").collection("<nama_collection>").updateMany({
  /* where */
});
```

---

## DQL

---

### DQL pada SQL

```
SELECT ...
FROM ...
WHERE ...
ORDER BY ...
LIMIT ...
OFFSET ...
```

---

### FROM

`FROM` digantikan dengan nama collection yang dipilih

```js
// mongosh
db.nama_collection.findOne();
db.nama_collection.find();
// JavaScript
await client
  .db("<nama_database>")
  .collection("<nama_collection>")
  .findOne()
  .toArray();
await client
  .db("<nama_database>")
  .collection("<nama_collection>")
  .find()
  .toArray();
```

---

### WHERE

```js
// mongosh
db.nama_collection.findOne({
  /* where */
});
db.nama_collection.find({
  /* where */
});
// JavaScript
await client
  .db("<nama_database>")
  .collection("<nama_collection>")
  .findOne({
    /* where */
  })
  .toArray();
await client
  .db("<nama_database>")
  .collection("<nama_collection>")
  .find({
    /* where */
  })
  .toArray();
```

---

### SELECT

```js[1-9|10-18|20-30]
// mongosh
db.nama_collection.findOne({/* where */},
						   {/* attributes */})
db.nama_collection.find({/* where */},
						{/* attributes */})
//   cara alternatif:
db.nama_collection.find({/* where */})
  .projection({/* attributes */})
//   contoh:
db.coll.find({name: "Max"}, {_id:0, name:1})
//   0 berarti tidak ditampilkan,
//   1 berarti ditampilkan.
//   semua angka harus sama (kecuali _id)
//   misal: {name:1, createdAt:1} berarti
//     hanya field name, createdAt, dan _id
//     yang dikembalikan
//   {name:0, createdAt:0} berarti semua field
//     ditampilkan kecuali name dan createdAt

// JavaScript
await client.db("<nama_database>")
  .collection("<nama_collection>")
  .findOne({/* where */})
  .project({/* attributes */})
  .toArray();
await client.db("<nama_database>")
  .collection("<nama_collection>")
  .find({/* where */})
  .project({/* attributes */})
  .toArray();
```

---

### [Aggregation Operator](https://www.mongodb.com/docs/manual/reference/operator/aggregation/#aggregation-operators)

- Gunanya mirip dengan function
- Bisa digunakan pada projection untuk membuat field baru

---

### ORDER BY, LIMIT, OFFSET

```js
// mongosh
db.nama_collection
  .find({
    /* where */
  })
  .sort({
    /* attributes */
  })
  .skip(/* skip */)
  .limit(/* limit */);
// JavaScript
await client
  .db("<nama_database>")
  .collection("<nama_collection>")
  .find({
    /* where */
  })
  .sort({
    /* attributes */
  })
  .skip(/* skip */)
  .limit(/* limit */)
  .toArray();
```

---

### Aggregation

- memproses semua dokumen dalam collection kemudian mengembalikan collection baru berisi dokumen yang telah diproses
- Dapat disusun dari beberapa "stage". Semua dokumen diproses kedalam sebuah stage, kemudian hasilnya diproses ke stage berikutnya hingga semua stage telah dilakukan

---

### [Aggregation stages](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/)

Berikut adalah contoh beberapa aggregation stages:

- [`$addFields`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/addFields/#mongodb-pipeline-pipe.-addFields): untuk menambah attribute baru di dokumen yang dikembalikan
- [`$count`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/count/#mongodb-pipeline-pipe.-count): menghitung jumlah dokumen hasil stage sebelumnya
- [`$group`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/#mongodb-pipeline-pipe.-group): seperti group by di SQL. Baca juga [accumulator operator](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/#accumulator-operator)
- [`$limit`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit) & [`$skip`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/skip/#mongodb-pipeline-pipe.-skip): seperti limit dan offset pada SQL

---

### [Aggregation stages](https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/)

- [`$lookup`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/#mongodb-pipeline-pipe.-lookup): seperti join pada SQL
- [`$match`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/match/#mongodb-pipeline-pipe.-match): untuk memfilter dokumen seperti where
- [`$project`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/project/#mongodb-pipeline-pipe.-project): seperti project / projection
- [`$sort`](https://www.mongodb.com/docs/manual/reference/operator/aggregation/sort/#mongodb-pipeline-pipe.-sort): seperti order by pada SQL

---

### Aggregation stages

- beberapa contoh stage kegunaannya mirip dengan query biasa (misalnya `$match` dan `$limit`)
- perbedaaannya adalah kita perlu menggunakan stage jika querynya mau dilakukan ke hasil output aggregation pipeline lain
- Misal: untuk menghitung 5 barang paling banyak terjual, kita harus melakukan `$group` terlebih dahulu baru `$sort` dan `$limit`. Kita tidak bisa menggunakan function `.limit()` seperti di `.find()`

---

### Contoh Aggregation pipeline

```js
db.coll.aggregate([
  { $match: { status: "A" } },
  {
    $group: {
      _id: "$cust_id",
      total: { $sum: "$amount" },
      average: { $avg: "$amount" },
    },
  },
  { $sort: { total: -1 } },
]);
```

contoh perbandingan aggregation dengan syntax sql dapat dilihat [di sini](https://www.mongodb.com/docs/v7.0/reference/sql-aggregation-comparison/)
