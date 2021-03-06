(function() {
    var tel = $("#tel");
    var code = $("#code");
    var codeBtn = $("#codeBtn");
    var submitBtn = $("#submitBtn");

    var activityId = getUrlParameter('activityId');
    var parentId = getUrlParameter('parentId');


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

    var sendCodeApi = '/home/index/sms';
    var submitApi = '/home/index/join';

    var checkTel = function(tel) {
        return /^1[34578]\d{9}$/.test(tel);
    };
    /*
    输入手机号的过程中，时刻（400ms）检测手机号格式，
    正确则获取验证码按钮亮起且可用，
    错误则仅提示格式错误。
    验证码不能为空
    */
    var isTel = false;
    var checkTimer, countDownTimer, telVal, codeVal;
    var eventId; // 检验验证码的凭证

    tel.on('input', function() {
        telVal = $(this).val();

        clearTimeout(checkTimer);
        checkTimer = setTimeout(function() {
            if (checkTel(telVal)) {
                isTel = true;
                codeBtn.removeClass('disable');
            } else {
                isTel = false;
                codeBtn.addClass('disable');
            };
        }, 400);

    });
    // 倒计时开始
    var isCountDown = false;
    var startCountDown = function(time) {
        // 是否正在倒计时
        if (isCountDown) {
            return;
        } else {
            isCountDown = true;
        };
        // 传递的参数是不是number
        if (typeof parseInt(time) !== 'number') { return };

        var _time = time;
        codeBtn.text(time + 's'); // 60s
        codeBtn.addClass('disable');

        clearInterval(countDownTimer);
        countDownTimer = setInterval(function() {
            if (_time !== 0) {
                _time--;
                codeBtn.text(_time + 's');
            } else {
                clearInterval(countDownTimer);
                codeBtn.text('获取验证码');
                codeBtn.removeClass('disable');
                isCountDown = false;
            }

        }, 1000);
    };
    // 获取验证码
    codeBtn.on('click', function() {
        // 如果正在倒计时，退出函数。
        if (isCountDown) {
            toastError('请等到倒计时结束');
            return;
        }
        if (!telVal) {
            toastError('手机号码不能为空');
        } else {
            if (isTel) {
                // TODO 获取验证码
                $.post(sendCodeApi, { phone: telVal }, function(res) {
                    if (res.errno == 0) {
                        toast('短信验证码发送成功');
                    } else {
                        toastError(res.errmsg);
                    }
                });
                // 开始倒计时
                startCountDown(60);

            } else {
                toastError('手机号码格式不正确');
            }
        }
    });

    // 提交
    submitBtn.on('click', function() {
        var name = $("#name").val();
        codeVal = code.val();
        if (name && isTel && !!codeVal) {
            $.post(submitApi, {
                phone: telVal,
                code: codeVal,
                userName: name,
                activityId: activityId,
                parentId: parentId
            }, function(res) {
                if (res.errno == "0") {
                    toast('参与成功');
                    var url = 'detail.html?parentId=' + $.fn.cookie('openId') + "&activityId=" + activityId
                    window.location.href = url;
                } else {
                    toastError(res.errmsg);
                }
            });
        } else {
            if (!name) {
                toastError('姓名不能为空');
            } else if (!telVal) {
                toastError('手机号码不能为空');
            } else if (!isTel) {
                toastError('手机号码格式不正确');
            } else if (!codeVal) {
                toastError("验证码不能为空");
            }
        }
    });
})();