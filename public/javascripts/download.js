//获取作品ID
function getID(searchWord){
    alert('进入getID')
/*          let blob = this.response;
            let u = window.URL.createObjectURL(new Blob([blob]));
            let a = document.createElement('a');
            a.download = name;
            a.href = u;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();*/
    return new Promise( (resolve, reject) => {
        var urlReg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g
        var url = urlReg.exec(searchWord)[0]
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var myregexp = /video\/(\d*)/
                resolve(myregexp.exec(xhr.responseURL)[1])
            } else {
                reject(v_xhr.status)
            }
        };
        xhr.send()
    })
}

//获取作品信息
function getInfo (d) {
    alert('进入getInfo')
    //官方接口
    var url = 'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids='
    url += d
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest()
        xhr.open('get', url, true)
        xhr.setRequestHeader('content-type','application/x-www-form-urlencoded')
        xhr.responseType = 'json'
        xhr.onload = function() {
            var status = xhr.status
            if (status == 200) {
                resolve(xhr.response)
            } else {
                reject(xhr.status)
            }
        }
        xhr.send()
    })
}

//获取作者ID
function getUID(searchWord){
    alert('进入getUID')
    return new Promise( (resolve, reject) => {
        var uid = /user\/([^\/:]*)\?enter_from/;
        try {
            resolve(uid.exec(searchWord)[1])
        } catch (error) {
            reject(error)
        }
    })
}

//获取所有作品信息
function getAllInfo (d) {
    alert('进入getAllInfo')
    //官方接口
    var url = 'https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids='
    url += d
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest()
        xhr.open('get', url, true)
        xhr.responseType = 'json'
        xhr.onload = function() {
            var status = xhr.status
            if (status == 200) {
                resolve(xhr.response)
            } else {
                reject(xhr.status)
            }
        }
        xhr.send()
    })
}

//下载作品
function getVideo (url,title) {
    alert('进入getVideo')
	var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.setRequestHeader("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1 Edg/92.0.4515.107");
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
			//如果请求执行成功
        if (this.status == 200) {
            var blob = this.response;
            var filename = 'C:\\Users' + title + '.mp4';
            var a = document.createElement('a');
            blob.type = "application/octet-stream";
            //创键临时url
            var url = URL.createObjectURL(blob);
            a.href = url;
            a.download=filename;
            a.click();
            //释放URL对象
            window.URL.revokeObjectURL(url);
        }
    };
    xhr.send();
}