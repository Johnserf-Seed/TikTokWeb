const axios = require("axios");

// 常量定义
const invalid = /[\\\n\r/:*?\"<>|]/g;
const repWith = ``;
const AWE_URL_BASE = "http://aweme.snssdk.com/aweme/v1/play/?";
const DETAIL_URL_BASE = 'https://www.douyin.com/aweme/v1/web/aweme/detail/?'
const USER_AGENT_MOBILE = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36";
const USER_AGENT_DESKTOP = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";
const VIDEO_REGEX = /video\/(\d*)/;
const NOTE_REGEX = /note\/(\d*)/;

/**
 * 获取作品ID
 * @param {string} dyurl - 抖音短链接。
 * @returns {string} 作品ID
 * @throws {Error} 在请求失败或解析ID时可能会抛出错误。
 */
async function GetID(dyurl) {
    const response = await axios.get(dyurl, {
        headers: { "user-agent": USER_AGENT_DESKTOP },
    });

    if (response.request.res.responseUrl.includes('video')) {
        item_ids = VIDEO_REGEX.exec(response.request.res.responseUrl)[1];
    } else if (response.request.res.responseUrl.includes('note')) {
        item_ids = NOTE_REGEX.exec(response.request.res.responseUrl)[1];
    } else {
        console.error("URL格式不匹配任何已知模式");
        return;
    }
    return item_ids;
}

/**
 * 根据作品ID和cookie获取作品详细信息
 * @param {string} item_ids - 作品ID。
 * @param {Object} dycookie - 抖音cookie对象。
 * @param {Function} getXB - 获取XB参数的函数。
 * @returns {Object} 作品的详细信息
 * @throws {Error} 在请求失败或解析数据时可能会抛出错误。
 */
async function GetInfo(item_ids, dycookie, getXB) {
    // 构造请求URL
    const params_url = `aweme_id=${item_ids}&aid=1128&version_name=23.5.0&device_platform=android&os_version=2333`;
    const xb = getXB(params_url);
    const url = `${DETAIL_URL_BASE}${params_url}&X-Bogus=${xb}`;

    const response = await axios.get(url, {
        headers: {
            'cookie': `odin_tt=${dycookie["odin_tt"]};sessionid_ss=${dycookie["sessionid_ss"]};ttwid=${dycookie['ttwid']};passport_csrf_token=${dycookie['passport_csrf_token']};msToken=${dycookie['msToken']};`,
            'referer': 'https://www.douyin.com/',
            'user-agent': USER_AGENT_MOBILE
        }
    });

    // 如果response.data为空或未定义
    if (!response.data) {
        return { work: false };
    }

    // 校验响应状态
    if (response.data.status_code === 0) {
        // 提取需要的数据
        const { video, music, author, desc, aweme_id, aweme_type } = response.data.aweme_detail;
        const unique_id = author.unique_id || author.short_id; // 如果unique_id为空，则使用short_id
        const userhome = `https://www.douyin.com/user/${author.sec_uid}`;
        const type = Number(aweme_type) === 0 ? '视频' : '图集';
        const images = Number(aweme_type) !== 0 ? response.data.aweme_detail.images.map(image => image.url_list[0]) : [];
        //const images = aweme_type !== 0 && response.data.aweme_detail.images ? response.data.aweme_detail.images.map(image => image.url_list[0]) : [];

        const url = video?.bit_rate?.[0]?.play_addr?.url_list?.[0] ?? '';
        const cleanedDesc = desc.replaceAll(invalid, repWith);

        return {
            url,
            desc: cleanedDesc,
            music: music.play_url.uri,
            m_title: music.title,
            nickname: author.nickname,
            unique_id,
            video_id: aweme_id,
            userhome,
            type,
            images
        };
    } else {
        // 如果响应状态码不为0，抛出错误
        throw new Error(`Error with status code: ${response.data.status_code}`);
    }
}

module.exports = { GetID, GetInfo };
