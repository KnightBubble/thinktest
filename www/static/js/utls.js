;
'use strict';
//var htmlStr = require('payment/serveSelf.html');
var utls = {
    getMyObjFromUrl: function(obj) {

        var tempObj = {};
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            tempObj[sParameterName[0]] = sParameterName[1];
        }
        for (var i in obj) {
            obj[i] = tempObj[i] ? tempObj[i] : obj[i];
        }

        return obj;
    },
    getUrlParameter: function(sParam) {

        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');

        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] === sParam) {
                return decodeURI(sParameterName[1]);
            }
        }

    },
    getJsonNameArr: function(obj) {
        //只考虑一层，且键值为字符串
        var temp = [];
        for (var i in obj) {
            if (typeof(obj[i]) === 'string') {
                temp.push(i);
            }
        }
        return temp;

    },

    shengxuArr: function(arr) {
        //数字与字符混合升序？
        return arr.sort();
    },
    getJsonShengxuArr: function(obj) {
        //先获得键名的升序排列，再按顺序，将对应键名push入数组
        var nameArr = utls.getJsonNameArr(obj).sort();
        var arrLength = nameArr.length;
        var tempArr = [];
        for (var i = 0; i < aarrLength; i++) {
            tempArr.push(obj[nameArr[i]]);
        }
        return tempArr;
    },
    checkMoney: function(moneyStr) {
        if (moneyStr === '') {
            return true;
        }
        var no = parseFloat(moneyStr);
        //先不管商家第三位小数四舍五入情况，假设。只能两位小数
        //console.log(moneyStr);
        if (((no + '').length === moneyStr.length) && (no > 0)) {
            //console.log(no);
            return true;
        }
        return false;
    },
    ifTwoPointNum: function(moneyStr) {

        return /^-?\d+\.?\d{0,2}$/.test(moneyStr);
    },
    getReqId: function(token) {
        var timeStamp = +(new Date());
        var token = token || utls.randomString(19);
        var wholeString = +(new Date()) + token;

        if (typeof(md5) === 'function') {
            return md5(wholeString);
        } else {
            return wholeString.substr(0, 32);
        }
        // return typeof(md5) === 'function' ? md5(wholeString) : wholeString.substr(0,32)

    },
    randomString: function(len) {　　
        //网上考的
        len = len || 32;　　
        var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
        var maxPos = $chars.length;　　
        var pwd = '';　　
        for (var i = 0; i < len; i++) {　　　　
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));　　
        }　　
        return pwd;
    },
    formatMoney: function(s, n, unit) {
        if (unit == 'percent') {
            s = (parseInt(s) / 100).toFixed(2);
        }
        n = n > 0 && n <= 20 ? n : 0;
        if (s < 0) {
            var _s = 0;
            return _s.toFixed(n);
        }
        s = parseFloat((s + "")
                .replace(/[^\d\.-]/g, ""))
            .toFixed(n) + "";
        var l = s.split(".")[0].split("")
            .reverse();
        var r = s.split(".")[1];
        var t = "",
            i;
        for (i = 0; i < l.length; i++) {
            t += l[i] + ((i + 1) % 3 === 0 && (i + 1) !== l.length ?
                "," :
                "");
        }
        if (r) {
            return t.split("")
                .reverse()
                .join("") + "." + r; // 99.99
        } else {
            return t.split("")
                .reverse()
                .join("");
        }
    },
    formatData: function(format) {
        var now = new Date(),
            year = now.getFullYear(), //年
            month = now.getMonth() + 1, //月
            day = now.getDate(), //日      
            hh = now.getHours(), //时
            mm = now.getMinutes(), //分
            ss = now.getSeconds(); //秒

        var clock = year + "-";
        if (month < 10)
            clock += "0";
        clock += month + "-";
        if (day < 10)
            clock += "0";
        clock += day + " ";

        if (hh < 10)
            clock += "0";
        clock += hh + ":";

        if (mm < 10) clock += '0';
        clock += mm + ':';

        if (ss < 10) clock += '0';

        clock += ss;
        return clock;
    },
    formatWeek: function(nub) {
        var arr = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        return arr[nub];
    }
};