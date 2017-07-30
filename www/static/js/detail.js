(function() {
    var detailApi = "http://127.0.0.1:8360/home/index/list";

    $.post(detailApi, {}, function(res) {
        if (!res.data) {
            debugger;
        } else {
            debugger;
            toastError('test');
        }
    });
})();