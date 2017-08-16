(function() {
    var detailApi = "/home/index/user_support_info";
    $('.section').hide();
    var activityId = getUrlParameter('activityId');
    parentId = getUrlParameter('parentId') || "";
    $.post(detailApi, {
        activityId: activityId
    }, function(res) {
        if (res.errno == '0') {
            renderView(res.data);
        } else {
            toastError(res.errmsg);
        }
    });

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return decodeURI(sParameterName[1]);
            }
        }
    }

    function isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == 'micromessenger') {
            return true;
        } else {
            return false;
        }
    }
    if (isWeiXin()) {
        /**
         * 初始化二次分享
         */
        var shareLink = window.location.origin + '/home/index/detail.html?activityId=' + activityId + '&parentId=' + (parentId || $.fn.cookie('openId'));
        var wxObj = {
            desc: $('.shareTitle').data('title'),
            title: '快来参与活动吧',
            link: shareLink,
            imgUrl: $('.shareIcon').data('icon')
        };
        shareConfig(wxObj);
    }

    renderView = function(data) {
        //status 0====未参与    1===已经参与
        var map = {
            0: "否",
            1: "是"
        }
        if (data.status == true) {
            var dom = '';
            var data = data.list;
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var li = "<li><span class = 'name'>" + item.userName || item.nickName + "</span><span class = 'status'>" + map[item.status] + "</span ><span class='date'>" + item.joinTime + "</span> </li>";
                dom += li;
            }
            $('ul.list').append(dom);
            if (data.length == 0) {
                $('.act-rules.list').hide();
                $('.no-supporter').show();
            } else {
                $('.act-rules.list').show();
                $('.no-supporter').hide();
            }
            $('.joined').show();
        } else {
            $('.notJoin').show();
        }
    }

    $('.go2join').click(function() {
        window.location.href = './register.html?activityId=' + activityId + "&parentId=" + parentId;
    })

})();