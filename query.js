const db = require('./db').Connection();
const fs = require('fs');

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

class