const request = require('request');
const cheerio = require('cheerio');

function getHouseLists(){
    return new Promise((resolve,reject)=>{
        request('https://cd.lianjia.com/ershoufang/',(error, response, body)=>{
            console.log(error)
            // debugger
            console.log(response)
        })
    })
}
