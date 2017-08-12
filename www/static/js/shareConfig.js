var shareConfig = function(option) {
    /**
     * 获取JS SDK Config参数接口地址
     */
    var getSDKConfigApi = "/home/index/jsconfig";
    var option = option || {};
    // var wxurl = encodeURIComponent(location.href);
    // 分享相关
    var shareOption = {
        title: option.title,
        desc: option.desc,
        link: option.link,
        imgUrl: option.imgUrl,
        success: function() {
            console.log('分享成功')
        },
        cancel: function() {}
    }

    /**
     * js sdk 入参
     */

    var params = {
        // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        debug: false,
        // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        jsApiList: [
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
        ],
        url: "http://www.bzxlkj.com"
    }

    $.post(getSDKConfigApi, params, function(res) {
        if (res.errno == '0') {
            debugger;
            var data = res.data;
            wx.config(data);

            wx.ready(function() {
                // 分享朋友圈
                wx.onMenuShareTimeline(shareOption);
                // 分享给朋友
                wx.onMenuShareAppMessage(shareOption);
            });
        } else {
            toastError('获取JS SDK CONFIG 参数失败');
        }
    });
};