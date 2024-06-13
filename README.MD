# MongoDB

Special Thanks to Pak Evan!

---

## Penjelasan penggunaan tutor

- File index.js itu contoh bagaimana kita run something
- File seeder.js itu untuk seed data awal (pakai faker), cocok untuk coba2 latihan menggunakan find, aggregation, projection dst
- Untuk run tinggal pakai node index.js atau node seeder.js

---

## MongoDB

> MongoDB is a general-purpose, feature-rich, and powerful document-based NoSQL database that provides efficient and flexible storage for a variety of different types of data sets.

---

## Instalasi untuk contoh ini

- npm i express mongodb
- npm i -D @faker-js/faker

## Install MongoDB

- Install mongodb windows community edition dari https://www.mongodb.com/try/download/community
  - Untuk cara gampang, install complete saja, lalu tinggal next-next sampai selesai (seharusnya dengan ini sekalian meng-install compass)
  - Peringatan, jangan install mongo compass pada step ini, karena super lama (kemungkinan karena mereka download compass di background)

## Install MongoSH

- Bila ingin menggunakan terminal untuk menggunakan MongoDB, bisa menggunakan mongosh
- Install di https://www.mongodb.com/try/download/shell
- Setelah install extract ke sebuah folder/lokasi yang kalian mau, lalu daftarkan ke environment variable laptop/komputer kalian

## MongoDB GUI

- Ada banyak pilihan
  - MongoDB Compass gratis, langsung dari developer, katanya tidak terlalu jago
  - Robo3T / Studio 3T, katanya sih bagus, ada versi free dan berbayar
  - NoSqlBooster support javascript, lebih jago, tapi bayar
- Untuk kuliah ini kita akan pakai mongosh dan compass
- Install di https://www.mongodb.com/try/download/compass

---

## Cheat Sheet

- https://www.mongodb.com/developer/products/mongodb/cheat-sheet/

---

## Perbandingan MongoDB dengan SQL biasa

| SQL         | MongoDB    |
| ----------- | ---------- |
| database    | database   |
| table       | collection |
| column      | field      |
| row         | document   |
| Primary Key | \_id       |

---

\_id

- setiap document memiliki primary key bernama \_id
- field \_id bisa diisi manual oleh user
- jika tidak diisi, mongodb akan otomatis membuatkan id dalam bentuk ObjectID

---

## MongoDB + NodeJs

- Untuk membuat aplikasi JavaScript yang bisa terkoneksi dengan database MongoDB, dapat digunakan [MongoDB Node.js Driver](https://www.npmjs.com/package/mongodb)
- Installasi: `npm install mongodb`
- Untuk membuat model (ODM) dapat digunakan [mongoose](https://www.npmjs.com/package/mongoose) (Minggu depan, ta rundingkan sama pak evan dulu)

---

## Manage database dan collection

Untuk melihat database

`show dbs`

Untuk menggunakan sebuah database dan buang database

`use kuliah_ws_inf`

`db.dropDatabase("kuliah_ws_inf")`

Untuk manage collection (buat, lihat, dan drop)

`db.createCollection("accounts")`

`show collections`

`db.createCollection("accounts")`

`db.posts.insertOne({})`

`db.getCollectionNames()`

`db.posts.drop()`

## Manage index

Index digunakan untuk improve query performance, selain itu juga digunakan untuk beberapa kegunaan misalnya menjadikan sebuah field menjadi unique

- Index membantu mempercepat pengaksesan data
- Index disimpan dalam bentuk B-tree

```js
// single index
db.nama_collection.createIndex({ name: 1 });
// compound index
// tanda 1 artinya di index secara ascending
// tanda -1 artinya di index secara descending
db.nama_collection.createIndex({ name: 1, gpa: -1 });
// unique index
db.nama_collection.createIndex({ email: 1 }, { unique: true });
// compound unique index
db.nama_collection.createIndex(
  { groupNumber: -1, lastname: 1, firstname: 1 },
  { unique: true }
);

// contoh, yok dicoba
db.accounts.createIndex({ email: 1 }, { unique: true });
```

## Insert, Update, dan Delete

Untuk insert satu data

```json
db.accounts.insertOne({_id:"lipsum", email:"lipsum@example.com", birthday:ISODate("2000-06-25")})
```

Untuk insert banyak data

```json
db.accounts.insertMany(
  [
    {_id:"lipsum2", email:"lipsum2@example.com", birthday:ISODate("2002-02-22")},
    {email:"mimi@gmail.com"},
    {birthday:ISODate("2001-01-21")}
  ])
```

Untuk insert one tapi dalamnya bisa dalam bentuk array of object dan segala variasinya

```json
db.posts.insertOne({
          "title": "Vicissitudo abduco",
          "content": "Quae averto quos patria dicta fuga rerum.",
          "createdAt": ISODate("2023-06-18"),
          "comments": [
            {
              "content": "Cedo vapulus",
              "createdAt": ISODate("2023-08-08"),
              "commenter": {
                "_id": "lipsum",
                "email": "lipsum@example.com"
              }
            },
            {
              "content": "Supra vobis",
              "createdAt": ISODate("2023-08-08"),
              "commenter": {
                "_id": "dolorsit",
                "email": "dolorsit@example.com"
              }
            },
          ],
          "author": "lipsum",
          "likes": [
            "lipsum",
            "dolorsit",
          ]
        })
```

Untuk update

```json
db.accounts.updateOne({_id:"lipsum"}, {$set:{email:"test@example.com"}})
```

Coba update banyak ya

```json

db.accounts.insertMany(
  [
    {nama:"mimi"},
    {nama:"mimi"},
    {nama:"mimi"}
  ])

db.accounts.updateMany({nama:"mimi"}, {$set:{nama:"mimi2",email:"mimi@gmail.com"}})
```

Untuk delete

```json
db.accounts.deleteOne({_id:"lipsum2"});
```

Coba delete banyak ya

```json
db.accounts.deleteMany({nama:"mimi2"})
```

## More Advanced Update

Coba kita lakukan update dengan menambah jumlah (increment)

```json
db.accounts.insertMany([
  {nama:"contohincrement",umur:20, makananfav:["nasgor","migor"]},
  {nama:"contohincrement",umur:22, makananfav:["rawon"]},
  {nama:"contohincrement",umur:23, makananfav:["penyetan","sate","tahu tek"]}
])

db.accounts.updateMany({nama:"contohincrement"},{$inc:{umur:5}});
```

Coba update dengan menambahkan data ke dalam array

```json
db.accounts.updateMany({nama:"contohincrement"},{$push:{makananFav:{$each:["seafood","thaifood"]}}});
```

Lah kok malah jadi ada makananfav dan makananFav? Yok diulangi

```json
db.accounts.updateMany({nama:"contohincrement"},{$unset:{makananFav:""}})
db.accounts.updateMany({nama:"contohincrement"},{$push:{makananfav:{$each:["seafood","thaifood"]}}})
```

Baca juga: [Query & projection operator](https://www.mongodb.com/docs/manual/reference/operator/query/) untuk digunakan di bagian where dan [Update operator](https://www.mongodb.com/docs/manual/reference/operator/update/) untuk digunakan di bagian update

---

## Schema Validation

- Di MongoDB data bersifat unstructured. Jadi attributenya bebas seperti object javascript
- Namun kadang-kadang ada attribute yang perlu pengecekan, misalnya ada attribute yang wajib ada, attribute yang tipe datanya harus angka, dll
- Pada collection bisa ditambahkan schema validation. Schema validation mengecek dokumen ketika insert dan update document
- Schema validation tidak mengecek data yang sudah ada di collection sebelum validation dibuat

## Contoh Schema Validation (mongosh)

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

## Update Schema Validation (mongosh)

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

## Fakta mengejutkan ttng const

- https://usefulangle.com/post/342/javascript-const-object-change-property

---
