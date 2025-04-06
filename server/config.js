const mysql = require("mysql2");

const db = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "",
    password: "",
    port: 3306,
    database: ""
});

module.exports = db;