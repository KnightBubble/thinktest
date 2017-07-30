var shareConfig = function(option){
    var option = option || {};
    // 分享相关
    var shareOption = {
        title: option.title || '15%收益白拿，有钱不赚非君子！',
        desc: option.desc || '直投熟人最高明，玩转借贷宝我最高明！',
        link: option.link || 'http://app.jiedaibao.com.cn/h5app/partials/dsp/index.html',
        imgUrl: option.imgUrl || 'http://app.jiedaibao.com.cn/h5app/img/dsp/default-head.png',
        success: function () {
            // _hmt.push(['_trackEvent', 'friend', 'share', 'timeline','success']);
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // _hmt.push(['_trackEvent', 'friend', 'share', 'timeline','cancel']);
            // 用户取消分享后执行的回调函数
        }
    }

    var wxurl = encodeURIComponent(location.href);
    var protocol = location.protocol || '';

    $.getJSON(protocol + '//tongji.jiedaibao.com/weixin/config?current_page_url='+ wxurl +'&app_id=wxc9a3c8c03a7fd87c', function (data) {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature,// 必填，签名，见附录1

            // jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage'
            ]
        });

        wx.ready(function () {
            // 分享朋友圈
            wx.onMenuShareTimeline(shareOption);
            // 分享给朋友
            wx.onMenuShareAppMessage(shareOption);
        });
    });
};