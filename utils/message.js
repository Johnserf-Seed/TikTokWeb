function Message(status, message, data) {
    var _this = this;

    _this.status = status ? status : undefined;
    _this.message = message ? message : undefined;
    _this.data = data ? data : undefined;

    /**
     * 设置状态码
     * @param status 状态码
     * @returns {Message}
     */
    _this.setStatus = function (status) {
        _this.status = status;
        return _this;
    }

    /**
     * 设置消息
     * @param message 信息内容
     * @returns {Message}
     */
    _this.setMessage = function (message) {
        _this.message = message;
        return _this;
    }

    /**
     * 设置数据
     * @param data 数据
     * @returns {Message}
     */
    _this.setData = function (data) {
        _this.data = data;
        return _this;
    }
}

module.exports = Message;