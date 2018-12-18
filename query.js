const mysql = require('mysql');
const fs = require('fs');

const db = mysql.createPool({
    host: "192.168.199.156",
    port: "3306",
    user: "root",
    database: "house",
    password: "123456789"
})

/**
 * 查询所有数据并生成json
 */
db.query('SELECT * FROM `house`',(err,data,fields)=>{
    if(err) throw err;
    let string = JSON.stringify(data)

    fs.writeFile('ret.json', string, 'utf8', (err) => {
        if (err) throw err;
        console.log('done');
    });
})