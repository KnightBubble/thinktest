'use strict';
import fs from 'fs';
import path from 'path';
import {
    promisify
} from 'util';
import Base from './base.js';
import OAuth from 'co-wechat-oauth';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const wechatConf = think.config('wechat');
const WechatOAuthApi = new OAuth(wechatConf.appid, wechatConf.appsecret, async function (openid) {
    // 传入一个根据openid获取对应的全局token的方法
    //think.cache('name', 'value');
    let token = await think.cache(openid);
    return token;
}, async function (openid, token) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    // 持久化时请注意，每个openid都对应一个唯一的token!
    await think.cache(openid, token);
});

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        let code = this.get('code');
        let parentId = this.get('parentId');
        let activityId = this.get('activityId');
        if (!code || !activityId) {
            return this.display();
        }
        if (this.wechatCode !== code) {
            let token = await WechatOAuthApi.getAccessToken(code);
            let openId = token.data.openid;
            let cacheOpenid = await this.cookie('openId');
            if (!cacheOpenid) {
                let userModel = this.model('admin/user');
                let userInfo = await userModel.getUserByOpenid(openId);
                if (!userInfo || !userInfo.openId) {
                    // userInfo 这里就是WechatOAuthApi 接口返回的
                    userInfo = await WechatOAuthApi.getUser(openId);
                    let insertId = await userModel.add({
                        userId: userInfo.openid,
                        openId: userInfo.openid,
                        uerPortrait: userInfo.headimgurl,
                        nickName: userInfo.nickname,
                        wechat: JSON.stringify(userInfo),
                    });
                }
            }
            this.session('openId', openId);
            this.cookie('openId', openId);
        }
        this.wechatCode = code;
        this.redirect(`/home/index/detail?parentId=${parentId}&activityId=${activityId}`);
        //auto render template file index_index.html

    }

    /**
     * @desc 微信授权
     */
    wechatAction() {
        let parentId = this.get('parentId') || "";
        let activityId = this.get('activityId');
        let callbackUrl = `${this.config('url')}?`;
        if (parentId) {
            callbackUrl += `parentId=` + parentId;
        }
        if (activityId) {
            callbackUrl += `&activityId=${activityId}`;
        }
        let oauthUrl = WechatOAuthApi.getAuthorizeURL(callbackUrl, '', 'snsapi_userinfo');
        this.redirect(oauthUrl);
    }

    /**
     * @desc 授权回调
     */
    async callbackAction() {
        let code = this.get('code');
        let parentId = this.get('parentId');
        let activityId = this.get('activityId');

        if (this.wechatCode !== code) {
            let token = await WechatOAuthApi.getAccessToken(code);
            let openId = token.data.openid;
            let cacheOpenid = await this.session('openId');
            if (!cacheOpenid) {
                let userModel = this.model('admin/user');
                let userInfo = await userModel.getUserByOpenid(openId);
                if (!userInfo || !userInfo.openId) {
                    userInfo = await WechatOAuthApi.getUser(openId);
                    let insertId = await userModel.add({
                        userId: userInfo.openId,
                        openId: userInfo.openId,
                        uerPortrait: userInfo.headimgurl,
                        nickName: userInfo.nickname,
                        wechat: JSON.stringify(userInfo),
                    });
                }
            }
            this.session('openId', openId);
            this.cookie('openId', openId);
        }
        this.wechatCode = code;
        this.redirect(`/home/index/detail?parentId=${parentId}&activityId=${activityId}`);
    }

    /**
     * 添加一条用户信息
     */
    // async addAction() {
    //     let userModel = this.model('admin/user');
    //     var openId = this.cookie('openId');
    //     var postData = this.post();
    //     var userInfo = {
    //         userId: openId,
    //         openId: openId,
    //         userName: postData.userName,
    //         uerPortrait: '',
    //         phone: '13955781781',
    //         parentId: 'aa' + Date.now(),
    //         signTime: Date.now()
    //     }
    //     let result = await userModel.thenAdd(userInfo, {
    //         userId: userId
    //     });
    //     if (result.userId != undefined) {
    //         this.json(result);
    //     } else {
    //         this.fail('ADD_USER_DB_ERROR');
    //     }
    // }

    async listAction() {
        let userModel = this.model('admin/user');
        let result = await userModel.getUserListByPage(1);
        this.json({
            errno: 0,
            errmsg: '查询成功',
            data: result
        });
    }

    /**
     * 参加活动
     * /home/index/join
     */
    async joinAction() {
        let postData = think.extend({}, this.post(), this.cookie());
        let openId = postData.openId;
        let phone = postData.phone;
        let code = postData.code;
        let activityId = postData.activityId;
        let cacheCode = await this.cache(phone);
        if (cacheCode != code) {
            this.fail('PHONE_CODE_ERROR');
            return;
        }
        let activityModel = this.model('admin/activity');
        let isActivityValid = await activityModel.isActivityValid(activityId)

        if (!isActivityValid) {
            return this.fail('ACTIVITY_UNVALID_ERROR');
        }

        let participatorModel = this.model('participator');
        let userModel = this.model('admin/user');

        let effectRow = userModel.updateNamePhone(openId, postData.userName, postData.phone);
        let insertId = await participatorModel.addParticipator(postData);
        if (insertId && effectRow) {
            this.json({
                errno: 0,
                errmsg: '参与活动成功'
            });
        } else {
            this.fail('ADDA_ACTIVITY_DB_ERROR');
        }
    }

    /**
     * 获取用户助力者名单
     * /home/index/support
     */
    // async userSupportAction() {
    //     let data = this.post();
    //     let parentId = data.openId;
    //     let activityId = data.activityId;
    //     let model = this.model('participator');
    //     let result = await model.userSupportors(parentId, activityId);
    //     if (result && result.length > 0) {
    //         this.json({
    //             errno: 0,
    //             errmsg: '查询成功',
    //             data: {
    //                 list: result
    //             }
    //         });
    //     } else {
    //         this.fail('USER_SUPPORTS_EMPTY_ERROR');
    //     }
    // }

    async detailAction() {
        let openId = this.cookie('openId');
        let activityId = this.get('activityId');

        let activityModel = this.model('admin/activity');
        let result = await activityModel.getActivityInfo(activityId);
        this.assign({
            data: result
        });
        if (openId) {
            return this.display('detail');
        } else {
            let parentId = this.get('parentId') || "";
            let activityId = this.get('activityId');
            let callbackUrl = `${this.config('url')}?`;
            if (parentId) {
                callbackUrl += `parentId=` + parentId;
            }
            if (activityId) {
                callbackUrl += `&activityId=${activityId}`;
            }
            let oauthUrl = WechatOAuthApi.getAuthorizeURL(callbackUrl, '', 'snsapi_userinfo');
            this.redirect(oauthUrl);
        }
    }

    /**
     * /home/index/user_support_info
     * 根据openid 获取是否参与的状态
     * 如果参与则返回支持者列表
     */
    async userSupportInfoAction() {
        try {
            let data = this.post();
            let openId = this.cookie('openId');
            let activityId = data.activityId;
            let model = this.model('participator');
            let isJoin = await model.isJoin(openId, activityId);
            let result = {};
            if (isJoin) {
                result = await model.userSupportors(openId, activityId);
                console.log('userSupportInfoAction model userSupportors=>');
                console.log(result);
                result.forEach(function (value) {
                    value.joinTime = think.datetime(new Date(value.joinTime * 1), 'YYYY-MM-DD');
                });
            }
            this.json({
                errno: 0,
                errmsg: '查询成功',
                data: {
                    status: isJoin,
                    list: result
                }
            });
        } catch (error) {
            console.log(error.message);
            this.fail('USER_SUPPORTS_EMPTY_ERROR');
        }
    }

    async registerAction() {
        let activityId = this.get('activityId');
        let activityModel = this.model('admin/activity');
        let result = await activityModel.getActivityInfo(activityId);
        console.log(result)
        this.assign({
            data: result
        });
        return this.display('register');
    }

    async testAction() {
        // let activityId = 13;
        // let status = 1;
        // let activityModel = this.model('admin/activity');
        // let isActivityValid = await activityModel.isActivityValid(activityId);
        // this.json({
        //     isActivityValid: isActivityValid
        // });

        let openId = 'oXm4awBQJ0dn9tIxDA2_XdCbcis0';
        let activityId = 13;
        let model = this.model('participator');
        let isJoin = await model.isJoin(openId, activityId);
        console.log(isJoin);
        let result = {};
        if (isJoin) {
            result = await model.userSupportors(openId, activityId);
            result.forEach(function (value) {
                value.joinTime = think.datetime(new Date(value.joinTime * 1), 'YYYY-MM-DD');
            });
        }
        console.log(result);
        this.json({
            isJoin: isJoin,
            data: result
        })

        // return this.display('test');
    }

    testweAction() {
        let parentId = this.get('parentId');
        let activityId = this.get('activityId');
        this.cookie('openId', 'oXm4awPHXv8PfhVjfzMj-aEuJ-Q8');
        this.redirect(`/home/index/detail?parentId=${parentId}&activityId=${activityId}`);
    }

    /**
     * 短信发送接口
     * /home/index/sms
     */
    async smsAction() {
        let phone = this.post('phone');
        let cacheCode = await this.cache(phone);
        console.log('cacheCode=>' + cacheCode);
        if (cacheCode) {
            this.json({
                errno: 0,
                code: cacheCode,
                errmsg: '已发'
            });
            return;
        }
        if (!this.cookie('openId')) {
            this.fail('NOT_HAVE_OPENID_ERROR');
            return;
        }

        let SmsService = think.service('sms');
        let instance = new SmsService();
        var code = Math.floor(Math.random() * (9999 - 999 + 1) + 999);
        console.log('code=>' + cacheCode);
        instance.sendSMS({
            PhoneNumbers: phone,
            TemplateParam: JSON.stringify({
                code: code
            }),
        }).then(BizId => {
            think.cache(phone, code, 5 * 60);
            this.json({
                // BizId: BizId,
                errno: 0,
                msg: '成功',
                data: {
                    code: code
                }

            });
        });
    }
}