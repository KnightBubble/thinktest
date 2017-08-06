'use strict';

export default {
    port: parseInt(process.env.LEANCLOUD_APP_PORT || process.env.PORT || 3000),
    url: 'http://serve.leanapp.cn',
    // wechat: {
    //     appid: 'wxcb816a269be9eebe',
    //     appsecret: '6bacd2cdc8344530629f5a420a86e518'
    // }
    wechat: {
        appid: 'wxf12e6671463b1e0a',
        appsecret: 'e2b5b91556b2530eedf873eb7e1c3752'
    }
};