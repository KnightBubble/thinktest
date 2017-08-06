(function() {
    var detailApi = "/home/index/user_support";
    $('.section').hide();
    $.fn.cookie('openId', '1KDJFKDJ4989DKFJK3D93KKLWL');

    $.post(detailApi, {
        activityId: "111",
        openId: "aa1501395236744",
    }, function(res) {
        if (res.errno == '0') {
            renderView(res.data);
        } else {
            toastError(res.errmsg);
        }
    });

    renderView = function(data) {
        //status 0====未参与    1===已经参与
        var map = {
            0: "否",
            1: "是"
        }
        if (!data.status == 1) {
            var dom = '';
            var data = data.list;
            for (var i = 0; i < data.length; i++) {
                var item = data[i];
                var li = "<li><span class = 'name'>" + item.nickName + "</span><span class = 'status'>" + map[item.status] + "</span ><span class='date'>" + item.joinTime + "</span> </li>";
                dom += li;
            }
            $('ul.list').append(dom);
            openId = $.fn.cookie('openId');
            var url = 'http://127.0.0.1:8360/home/index/register.html?openId=' + openId;
            // $('.url').text(url).attr('href', url);
            $('.url').attr('href', url);
            $('.joined').show();
        } else {
            $('.notJoin').show();
        }
    }

    $('.go2join').click(function() {
        window.location.href = './register.html';
    })

})();