/**
 * img2Base64.js
 * 
 * 图片转换与下载ZIP功能
 * 
 * 作者: Johnserf-Seed
 * 项目地址: https://github.com/Johnserf-Seed/TikTokWeb
 * 联系邮箱: johnserf-seed@foxmail.com
 */

/**
 * 将给定的图集转换为base64格式，打包并下载为ZIP文件
 *
 * @param {string} imagesStr - 以逗号分隔的图片URL字符串。
 * @param {string} desc - 描述或标题，用于命名ZIP文件。
 */
function downloadAll(imagesStr, desc) {
    let zip = new JSZip();
    let images = imagesStr.split(',');
    let imgBase64 = {};

    // 创建ZIP文件夹
    let folder = zip.folder(desc);

    // 遍历每个图片URL并转换为base64格式
    images.forEach((img, index) => {
        convertToBase64(img).then(base64 => {
            // 去除base64前缀
            imgBase64[index] = base64.substring(22);

            // 判断是否所有的图片都已转换
            if (Object.keys(imgBase64).length === images.length) {
                packageAndDownload();
            }
        }).catch(err => {
            console.log(err);
        });
    });

    /**
     * 打包已转换的图片并启动下载进程
     */
    function packageAndDownload() {
        images.forEach((img, index) => {
            folder.file(`${desc}${index}.jpg`, imgBase64[index], { base64: true });
        });
        zip.generateAsync({ type: "blob" }).then(content => {
            saveAs(content, `${desc}.zip`); // 命名并下载ZIP文件
        });
    }
}

/**
 * 将给定的图片URL转换为base64格式
 *
 * @param {string} img - 图片的URL。
 * @returns {Promise<string>} 转换后的base64格式字符串。
 */
function convertToBase64(img) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = img;
        image.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            const dataURL = canvas.toDataURL();
            resolve(dataURL);
        };
        image.onerror = reject;
    });
}
