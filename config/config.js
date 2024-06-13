// INI file yang akan menyimpan konfigurasi dari koneksi kita
// Kalau kalian masih ingat laravel, file ini kayak config/database.php

module.exports = {
    koneksi_buku: {
        host: process.env.DB_HOST,
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        database: process.env.DB_DBNAME,
        dialect: "mysql",
    },
};
