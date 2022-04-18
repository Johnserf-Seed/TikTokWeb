let express = require('express');
const axios = require('axios')
const errwin = /[\\\\/:*?\"<>|]/g;
const subwin = ``;
const httpurl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/

let router = express.Router();

// 获取作品ID
var GetID = function (dyurl) {
    return new Promise((resolve, reject) => {
        try {
            axios.get(dyurl, {
                headers: {
                    'user-agent': ' Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                }
            }).then(function (response) {
                console.log(response.request.res.responseUrl)
                var revideo = /video\/(\d*)/
                var item_ids = revideo.exec(response.request.res.responseUrl)[1]
                // console.log(item_ids)
                resolve(item_ids)
            }).catch(function (error) {
                console.log(error + 'item_ids获取错误')
                next(error)
                reject(error)
                // return 0;
            })
        } catch (error) {
            console.log(error)
        }
    })
}

var GetInfo =function (item_ids) {
    console.log('GetInfo ok')
    return new Promise((resolve, reject) => {
        axios.get(`https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=${item_ids}`, {
                    headers: {
                        'user-agent': ' Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                    }
                }
            ).then(function (response) {
                console.log('item_ids ok')
                // console.log("response", response.data)
                let {
                    status_code,
                    item_list
                } = response.data
                if (status_code === 0) {
                    // 无水印视频链接
                    let url = item_list[0].video.play_addr.url_list[0].replace(
                        'playwm',
                        'play'
                    )
                    // 视频文案
                    let desc = item_list[0].desc;
                    // 文案过滤非法字符
                    desc.replace(errwin, subwin);

                    console.log('video play url', url)
                    console.log('video desc', desc)

                    var data = ({
                        url: url,
                        desc: desc
                    })
                    resolve(data)
                } else {
                    reject(status_code)
                }
            })
            .catch(function (error) {
                console.log(error)
                reject(error)
            })
    })
}
/* GET api. */
router.get('/', async function(req, res, next) {
    if (req.query.url == ''){
        // 默认视频
        req.query.url = 'https://v.douyin.com/NKyY6Ch/'
    }
    console.log('open shorturl ok')
    console.log(req.query.url)

    // let urlReg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
    // let dyurl = urlReg.exec(req.query.url)[0]
    let dyurl = req.query.url;
    await GetID(dyurl).then(item_ids => {
        // console.log(item_ids)
        console.log('11111111111')
        GetInfo(item_ids).then(data => {
            console.log('11111111111',data)
            res.render('index', { data });
        });
    }).catch((err) =>{
        next(err)
        console.log(err)
    });

    console.log('open url ok')
});

module.exports = router;