(function() {
    var loginApi = "/admin/index/userLogin";
    $('button.submit').click(function() {
        var name = $('#username').val();
        var pwd = $('#passwd').val()
        if (!name) {
            return;
        }
        if (!pwd) {
            return;
        }
        $.post(loginApi, {}, function(res) {
            if (res.errno == '0') {
                window.location = '/admin/index/index.html';
            } else {
                alert(res.errmsg);
            }
        });
    })

})();