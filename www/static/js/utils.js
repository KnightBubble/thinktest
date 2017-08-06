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
    }
};