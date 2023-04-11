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
var GetID = async function (res,dyurl) {
    try {
        return await new Promise((resolve, reject) => {
            try {
                axios.get(dyurl, {
                    headers: {
                        'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1'
                    }
                }).then(function (response) {
                    // console.log(response.request.res.responseUrl);
                    var revideo = /video\/(\d*)/;
                    var item_ids = revideo.exec(response.request.res.responseUrl)[1];
                    console.log('作品id  ' + item_ids);
                    resolve(item_ids);
                }).catch(function (error) {
                    console.log(error + '  item_ids获取错误');
                    res.render('error');
                    reject(error);
                });
            } catch (error_1) {
                console.log('获取作品ID失败   ' + error_1);
            }
        });
    } catch (error_2) {
        console.log(error_2);
        res.render('error');
        reject(error_2);
    }
}

// 获取作品信息
var GetInfo = async function (res,item_ids,dycookie) {
    try {
        return await new Promise((resolve, reject) => {
            const params_url = `aweme_id=${item_ids}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`;
            let xb = getXB(params_url);
            console.log(aweme_url + params_url + `&X-Bogus=${xb}`);
            axios.get(aweme_url + params_url + `&X-Bogus=${xb}`, {
                headers: {
                    'cookie': `odin_tt=${dycookie['odin_tt']};sessionid_ss=${dycookie['sessionid_ss']};ttwid=${dycookie['ttwid']};passport_csrf_token=${dycookie['passport_csrf_token']};msToken=${dycookie['msToken']};`,
                    'referer': 'https://www.douyin.com/',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
                }
            })
                .then(function (response) {
                    console.log('GetInfo ok');
                    let {
                        status_code
                    } = response.data;
                    // console.log(response)
                    if (status_code === 0) {
                        // 无水印视频链接
                        // let url = item_list.video.play_addr.url_list[0].replace(
                        //     'playwm',
                        //     'play'
                        // )
                        // let url = response.data.aweme_detail.video.play_addr.url_list[2]
                        let uri = response.data.aweme_detail.video.play_addr.uri;
                        let music = response.data.aweme_detail.music.play_url.uri;
                        let m_title = response.data.aweme_detail.music.title;
                        let unique_id = response.data.aweme_detail.author.unique_id;
                        let video_id = response.data.aweme_detail.aweme_id;
                        let aweme_type = response.data.aweme_detail.aweme_type;
                        let nickname = response.data.aweme_detail.author.nickname;
                        let userhome = 'https://www.douyin.com/user/' + response.data.aweme_detail.author.sec_uid;
                        let newimages = Array();
                        // 没有设置抖音号则获取短号
                        if (unique_id == '') {
                            unique_id = response.data.aweme_detail.author.short_id;
                        }
                        if (aweme_type == '0') {
                            var type = '视频';
                            var images = '';
                        } else {
                            var type = '图集';
                            var images = response.data.aweme_detail.images;
                            for (var i in images) {
                                newimages.push(images[i].url_list[0]);
                            }
                        }
                        // 转换成1080p
                        url = `http://aweme.snssdk.com/aweme/v1/play/?video_id=${uri}&ratio=1080p`;
                        // 视频文案过滤非法字符
                        let desc = response.data.aweme_detail.desc.replaceAll(errwin, subwin);

                        console.log('video play url  ', url);
                        console.log('video desc  ', desc);
                        var data = ({
                            url: url,
                            desc: desc,
                            music: music,
                            m_title: m_title,
                            nickname: nickname,
                            unique_id: unique_id,
                            video_id: video_id,
                            userhome: userhome,
                            type: type,
                            images: newimages
                        });
                        resolve(data);
                    } else {
                        console.log(status_code);
                        reject(status_code);
                    }
                }).catch(function (error) {
                    console.log(error);
                    res.render('error');
                    reject(error);
                });
        });
    } catch (error_1) {
        console.log(error_1);
        res.render('error');
        reject(error_1);
    }
}

/* GET api. */
router.get('/', async function(req, res, next) {
    console.log(req.cookies['dycookie'])
    if(req.cookies['dycookie'] == undefined){
        var data = ({
            work:false
        })
        res.render('index', data);
        return
    }
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