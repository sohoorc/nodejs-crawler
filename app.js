// const express = require('express');
// const app = express()
// const http = require('http').Server(app)
const request = require('request');
const cheerio = require('cheerio');
const mysql = require('mysql');

const db = mysql.createPool({
    host: "192.168.199.156",
    port: "3306",
    user: "root",
    database: "house",
    password: "123456789"
})
let currPage = 1;
let delay = 3000;
let baseUrl = 'https://cd.lianjia.com/ershoufang/';


function getHouseLists(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (!error) {
                resolve(body)
            } else {
                reject(error)
            }
        })
    })
}

function getHouseDetails(detailUrl) {
    return new Promise((resolve, reject) => {
        request(detailUrl, (error, response, body) => {
            if (!error) {
                let $dc = cheerio.load(body.toString())
                // 楼盘内容
                let $content = $dc('.overview .content')
                // 价格
                let $price = $content.find('.price')
                // 总价
                let totalPrice = $price.find('.total').text() * 10000
                // 单价
                let unitPrice = +$price.find('.unitPriceValue').text().replace(/[^0-9.]/ig, "")
                // 小区名称
                let name = $content.find('a.info').text()
                // 区域
                let district = $content.find('.areaName span.info').text()
                let year = +$content.find('.houseInfo .area .subInfo').text().replace(/[^0-9.]/ig, "")

                let houseId = +$content.find('.houseRecord span.info').text().replace(/[^0-9.]/ig, "")
                // debugger

                // 楼盘基本信息
                let $introduction = $dc('#introduction')

                let $introContent = null,
                    // 户型 X室X厅
                    houseType = null,
                    // 楼层
                    floor = null,
                    // 建筑面积
                    coveredArea = null,
                    // 户型结构 平层|复式 跃层等
                    structure = null,
                    // 套内面积
                    insideArea = null,
                    // 朝向
                    orientation = null,
                    // 装修状况
                    fitment = null,
                    // 梯户比例
                    thbl = null,
                    // 是否有电梯
                    hasElevator = null,
                    // 产权年限
                    property = null,
                    // 住宅交易信息
                    $transactionContent = null,
                    // 房屋用途  住宅 | 商住 | 别墅 等
                    housePurpose = null,
                    // 年限
                    isFiveYears = null,
                    // 抵押信息
                    mortgage = null;

                if ($introduction.length) {
                    // 楼盘信息内容
                    $introContent = $introduction.find('.introContent .base ul li').toArray()
                    // 户型 X室X厅
                    houseType = $introContent[0].children ? $introContent[0].children[1].data : null
                    // 楼层
                    floor = $introContent[1] ? $introContent[1].children[1].data : null
                    // 建筑面积
                    coveredArea = $introContent[2] ? +$introContent[2].children[1].data.replace(/[^0-9.]/ig, "") : 0
                    // 户型结构 平层|复式 跃层等
                    structure = $introContent[3] ? $introContent[3].children[1].data : null
                    // 套内面积
                    insideArea = $introContent[4] ? +$introContent[4].children[1].data.replace(/[^0-9.]/ig, "") : 0
                    // 朝向
                    orientation = $introContent[6] ? $introContent[6].children[1].data : null
                    // 装修状况
                    fitment = $introContent[8] ? $introContent[8].children[1].data : null
                    // 梯户比例
                    thbl = $introContent[9] ? $introContent[9].children[1].data : null
                    // 是否有电梯
                    hasElevator = $introContent[10] ? $introContent[10].children[1].data : null
                    // 产权年限
                    property = $introContent[11] ? +$introContent[11].children[1].data.replace(/[^0-9.]/ig, "") : 0
                    // 住宅交易信息
                    $transactionContent = $introduction.find('.transaction ul li').toArray()
                    // 房屋用途  住宅 | 商住 | 别墅 等
                    housePurpose = $transactionContent[3] ? $transactionContent[3].children[3].children[0].data : null
                    // 年限
                    isFiveYears = $transactionContent[4] ? $transactionContent[4].children[3].children[0].data : null
                    // 抵押信息
                    mortgage = $transactionContent[6] ? $transactionContent[6].children[3].children[0].data.trim() : null
                } else {
                    throw '请求出错了！！！！！'
                }

                let currHouseInfo = { houseId, name, year, totalPrice, unitPrice, district, houseType, floor, coveredArea, structure, insideArea, orientation, fitment, thbl, hasElevator, property, housePurpose, isFiveYears, mortgage }
                resolve(currHouseInfo)
            } else {
                reject(error)
            }
            //  debugger
        })
    })
}


function getHouse(url) {
    console.log('当前第' + url + '页+++++++++++++++++++++++++++++++++++++');
    return getHouseLists(url).then((res) => {
        ++currPage;
        let $list = cheerio.load(res, {
            normalizeWhitespace: true,
            xmlMode: true
        });
        let lists = $list('.sellListContent>li.LOGCLICKDATA')
        lists.each((index, item) => {
            let $item = $list(item);
            // 房源ID
            let houseId = $item.find('.unitPrice').attr('data-hid');

            let detailUrl = baseUrl + `${houseId}.html`;
            // 查询房源详情数据并插入到数据库中
            getHouseDetails(detailUrl).then((res) => {
                let { houseId, name, year, totalPrice, unitPrice, district, houseType, floor, coveredArea, structure, insideArea, orientation, fitment, thbl, hasElevator, property, housePurpose, isFiveYears, mortgage } = res;

                let keys = Object.keys(res).join(",");

                let sql = `INSERT INTO house(${keys}) VALUES(${houseId}, '${name}', ${year}, ${totalPrice}, ${unitPrice}, '${district}', '${houseType}', '${floor}', ${coveredArea}, '${structure}', ${insideArea}, '${orientation}', '${fitment}', '${thbl}', '${hasElevator}', '${property}', '${housePurpose}', '${isFiveYears}', '${mortgage}')`;

                db.query(sql, function (err, data, fields) {
                    if (err) throw err;
                    console.log('++++++插入数据成功', res)
                })
            })
        })

        if (currPage !== 1 && currPage <= 100) {
            setTimeout(() => {
                return getHouse(baseUrl + `pg${currPage}/`)
            }, delay)
        }
    }).catch((err) => {
        throw err;
    })
}

getHouse(baseUrl)
