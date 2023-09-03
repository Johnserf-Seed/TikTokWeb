const express = require('express');
const { GetID, GetInfo } = require('../utils/douyinService');
const getXB = require('../utils/x-bogus.js')

let router = express.Router();

/* 获取API */
router.get('/', async function(req, res, next) {
    try {
        // 尝试从cookies中获取并解析dycookie
        let dyCookie;
        try {
            dyCookie = JSON.parse(req.cookies['dycookie']);
        } catch {
            dyCookie = null;
        }


        // 如果未提供URL，则使用默认视频
        let videoUrl = req.query.url;
        if (!videoUrl) {
            videoUrl = 'https://v.douyin.com/NKyY6Ch/';
        }


        // 使用视频ID和cookie获取视频详情
        const videoData = await GetInfo(videoId, dyCookie, getXB);
        res.render('index', { videoData });
    } catch (error) {
        next(error);  // 转发错误到错误处理中间件
    }
});

});

module.exports = router;