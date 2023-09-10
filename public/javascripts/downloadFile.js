/**
 * downloadFile.js
 * 下载文件函数
 * 作者: Johnserf-Seed
 * 项目地址: https://github.com/Johnserf-Seed/TikTokWeb
 * 联系邮箱: johnserf-seed@foxmail.com
 * @param {string} url - 文件的URL地址。
 * @param {string} filename - 用户希望保存的文件名。
 */

/**
 * 功能描述:
 * 1. 首先检查文件大小，如果大于100MB，警告用户。
 * 2. 如果一切正常，使用blob和临时URL开始下载文件。
 * 3. 在下载过程中，如果遇到任何错误，都会通知用户。
 */

function downloadFile(url, filename) {
    fetch(url).then(response => {
        if (response.redirected) {
            const newUrl = response.url;  // 这是服务器重定向之后的URL。
            checkFileSizeAndDownload(newUrl, filename);
        } else {
            checkFileSizeAndDownload(url, filename);
        }
    })
    .catch(error => {
        Toast.fire('下载失败', error.message, 'error');
        console.error("下载错误: ", error.message);
    });
}

function checkFileSizeAndDownload(url, filename) {
    fetch(url, { method: 'GET' }).then(response => {
        const size = response.headers.get('Content-Length'); // 获取文件大小

        function proceedDownload() {
            fetch(url).then(response => {
                return response.blob();
            }).then(blob => {
                const objectURL = URL.createObjectURL(blob);
                const $a = $("<a>", {
                    href: objectURL,
                    download: filename
                }).appendTo("body");
                $a[0].click();
                $a.remove();
                URL.revokeObjectURL(objectURL);  // 清除对象 URL 以释放内存
            });
        }

        if (size && parseInt(size) > 100 * 1024 * 1024) { // 如果文件大于100MB
            Swal.fire({
                title: '大文件提示',
                text: '你即将下载一个大视频，可能需要更长时间。你确定要继续吗？',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '继续',
                cancelButtonText: '取消'
            }).then(result => {
                if (result.isConfirmed) {
                    proceedDownload();
                }
            });
        } else {
            proceedDownload();
        }
    });
}
