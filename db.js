const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "inventory_db"
});

connection.connect((err) => {
    if (err) {
        console.error("Database Connection Failed:", err);
        return;
    }

    console.log("MySQL Connected");
});

module.exports = connection;