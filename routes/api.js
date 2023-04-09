let express = require('express');
const axios = require('axios');
const res = require('express/lib/response');
const errwin = /[\\\n\r/:*?\"<>|]/g;
const subwin = ``;
const httpurl = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
// 获取XB参数
const getXB = require('../utils/x-bogus.js')
// 单作品接口
const aweme_url = 'https://www.douyin.com/aweme/v1/web/aweme/detail/?'
let router = express.Router();

// 获取作品ID
var GetID = function (res,dyurl) {
    return new Promise((resolve, reject) => {
        try {
            axios.get(dyurl, {
                headers: {
                    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                }
            }).then(function (response) {
                // console.log(response.request.res.responseUrl);
                var revideo = /video\/(\d*)/
                var item_ids = revideo.exec(response.request.res.responseUrl)[1]
                console.log('作品id  ' + item_ids);
                resolve(item_ids)
            }).catch(function (error) {
                console.log(error + '  item_ids获取错误');
                res.render('error');
                reject(error);
            })
        } catch (error) {
            console.log(error)
        }
    })
}

// 获取作品信息
var GetInfo =function (res,item_ids) {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.iesdouyin.com/aweme/v1/web/aweme/detail/?aweme_id=${item_ids}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`, {
                    headers: {
                        'cookie': 'ttcid=fc21ed8a713b4a689f0a96f9f2bcd94833; tt_scid=cvwB6NvZMh82mfKdjm9zU4xUwtpzvswItKu9vSyL50Yd8gAoJaX1CoIaLBKRykxb36f9',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
                    }
                }
            ).then(function (response) {
                console.log('GetInfo ok')
                // console.log("response", response.data)
                let {
                    status_code
                } = response.data
                // console.log(response)
                if (status_code === 0) {
                    // 无水印视频链接
                    // let url = item_list.video.play_addr.url_list[0].replace(
                    //     'playwm',
                    //     'play'
                    // )
                    // let url = response.data.aweme_detail.video.play_addr.url_list[2]
                    let uri = response.data.aweme_detail.video.play_addr.uri
                    // 转换成1080p
                    url = `http://aweme.snssdk.com/aweme/v1/play/?video_id=${uri}&ratio=1080p`
                    console.log('1080p  ',url);
                    // 视频文案
                    let desc = response.data.aweme_detail.desc;
                    // 文案过滤非法字符
                    desc.replace(errwin, subwin);

                    console.log('video play url  ', url);
                    console.log('video desc  ', desc);
                    var data = ({
                        url: url,
                        desc: desc
                    });
                    resolve(data);
                } else {
                    console.log(status_code);
                    reject(status_code);
                }
            }).catch(function (error) {
                console.log(error)
                res.render('error');
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
    console.log('open shorturl ok');
    // console.log(req.query.url)

    // let urlReg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
    // let dyurl = urlReg.exec(req.query.url)[0]
    let dyurl = req.query.url;
    await GetID(res,dyurl).then(item_ids => {
        GetInfo(res,item_ids,req.cookies['dycookie']).then(data => {
            //console.log('data',data);
            res.render('index', { data });
        });
    }).catch((error) =>{
        console.log('GetID Error',error);
        res.render('error');
    });

    console.log('open url ok');
});

module.exports = router;