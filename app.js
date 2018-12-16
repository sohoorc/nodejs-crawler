const express = require('express');

const app = express()
const request = require('request');
const http = require('http').Server(app)
const cheerio = require('cheerio');

app.use('/', express.static(__dirname + '/www'))

let currPage = 1

let url = 'https://cd.lianjia.com/ershoufang/'


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

                // dc: detailContent
                let $dc = cheerio.load(body)
                // 楼盘内容
                let $content = $dc('.overview .content')
                // 价格
                let $price = $content.find('.price')
                // 总价
                let totalPrice = $price.find('.total').text()
                // 单价
                let unitPrice = $price.find('.unitPriceValue').text()
                // 小区名称
                let name = $content.find('a.info').text()
                // 区域
                let district = $content.find('.areaName span.info').text()
                let year = $content.find('.houseInfo .area .subInfo').text()


                // 楼盘基本信息
                let $introduction = $dc('#introduction')
                // 楼盘信息内容
                let $introContent = $introduction.find('.introContent .base ul li').toArray()
                // 户型 X室X厅
                let houseType = $introContent[0].children[1].data
                // 楼层
                let floor = $introContent[1].children[1].data
                // 建筑面积
                let coveredArea = $introContent[2].children[1].data
                // 户型结构 平层|复式 跃层等
                let structure = $introContent[3].children[1].data
                // 套内面积
                let insideArea = $introContent[4].children[1].data
                // 朝向
                let orientation = $introContent[6].children[1].data
                // 装修状况
                let fitment = $introContent[8].children[1].data
                // 梯户比例
                let thbl = $introContent[9].children[1].data
                // 是否有电梯
                let hasElevator = $introContent[10].children[1].data
                // 产权年限
                let property = $introContent[11].children[1].data
                // 住宅交易信息
                let $transactionContent = $introduction.find('.transaction ul li').toArray()
                // 房屋用途  住宅 | 商住 | 别墅 等
                let housePurpose = $transactionContent[3].children[3].children[0].data
                // 年限
                let isFiveYears = $transactionContent[4].children[3].children[0].data
                // 抵押信息
                let mortgage = $transactionContent[6].children[3].children[0].data

                let currHouseInfo = { name, year, totalPrice, unitPrice, district, houseType, floor, coveredArea, structure, insideArea, orientation, fitment, thbl, hasElevator, property, housePurpose, isFiveYears, mortgage }
                resolve(currHouseInfo)
            } else {
                reject(error)
            }
            //  debugger
        })
    })
}


function getHouse(url) {
    return getHouseLists(url).then((res) => {
        ++currPage;
        let $list = cheerio.load(res, {
            normalizeWhitespace: true,
            xmlMode: true
        });
        let lists = $list('.sellListContent>li.LOGCLICKDATA')
        let arr = []
        lists.each((index, item) => {
            // console.log()
            let $item = $list(item)
            // 房源ID
            let houseId = $item.find('.unitPrice').attr('data-hid')

            let detailUrl = url + `${houseId}.html`
            getHouseDetails(detailUrl).then((res) => {
                let currHouseInfo = { ...res }
                console.log(currHouseInfo)
            }).catch((err) => {

            })
        })


        if (currPage !== 1) {
            setTimeout(() => {
                console.log(currPage)
                // return getHouse(url + `pg${currPage}/`)
            }, 1000)
        }
    }).catch((err) => {
        console.log(err)
    })
}

getHouse(url)


// http.listen(3000)