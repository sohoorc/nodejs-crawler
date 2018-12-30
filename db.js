const mysql = require('mysql');

function CreateDbConnection() {
    return mysql.createPool({
        host: "192.168.199.156",
        port: "3306",
        user: "root",
        database: "house",
        password: "123456789"
    })
}

module.exports = {
    Connection:CreateDbConnection
}