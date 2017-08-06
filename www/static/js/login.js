(function() {
    var loginApi = "/admin/admin/signin";
    $('button.submit').click(function() {
        var name = $('#username').val();
        var pwd = $('#passwd').val()
        if (!name) {
            return;
        }
        if (!pwd) {
            return;
        }
        $.post(loginApi, {
            username: name,
            password: pwd,
        }, function(res) {
            debugger;
            if (res.errno == '0') {
                window.location = '/admin/index/index.html';
            } else {
                alert(res.errmsg);
            }
        });
    })

})();