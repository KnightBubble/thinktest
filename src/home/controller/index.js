'use strict';

import Base from './base.js';
import OAuth from 'wechat-oauth';

const wechatConf = think.config('wechat');
const wechat = new OAuth(wechatConf.appid, wechatConf.appsecret);

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    indexAction() {
        //auto render template file index_index.html
        return this.display();
    }

    /**
     * @desc 微信授权
     */
    wechatAction() {
        let wechatUrl = wechat.getAuthorizeURL(`${this.config('url')}/home/index/callback`, '', 'snsapi_base');
        this.redirect(wechatUrl);
    }

    /**
     * @desc 授权回调
     */
    callbackAction() {
        let code = this.get('code');
        wechat.getAccessToken(code, (err, result) => {
            // let accessToken = result.data.access_token;
            // let openid = result.data.openid;
            // let unionid = result.data.unionid;
            console.log(result);
            // 判断有没有用户先
            if (true) {
                // 获取用户信息
            } else {
                wechat.getUser(openid, (err, res) => {
                    console.log(user);
                    // 创建用户
                });
            }
            this.display();
        });
    }

    /**
     * 添加一条用户信息
     */
    async addAction() {
        let userModel = this.model('admin/user');
        var userId = 'aa' + Date.now();
        var userInfo = {
            userId: userId,
            openId: 'aa' + Date.now(),
            userName: 'xx',
            uerPortrait: '',
            phone: '13955781781',
            parentId: 'aa' + Date.now(),
            signTime: Date.now()
        }
        let result = await userModel.thenAdd(userInfo, {
            userId: userId
        });
        if (result.userId != undefined) {
            this.json(result);
        } else {
            this.fail('ADD_USER_DB_ERROR');
        }
    }

    async listAction() {
        let userModel = this.model('admin/user');
        let result = await userModel.getUserListByPage(1);
        this.json({
            errno: 0,
            errmsg: '查询成功',
            data: result
        });
    }

    // 参加活动
    async joinAction() {
        let postData = this.post();
        let participatorModel = this.model('participator');
        let insertId = await participatorModel.addParticipator(postData);
        if (insertId) {
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
     */
    async userSupportAction() {
        let data = this.post();
        let parentId = data.openId;
        let activityId = data.activityId;
        let model = this.model('participator');
        let result = await model.userSupportors(parentId, activityId);
        if (result && result.length > 0) {
            this.json({
                errno: 0,
                errmsg: '查询成功',
                data: {
                    list: result
                }
            });
        } else {
            this.fail('USER_SUPPORTS_EMPTY_ERROR');
        }
    }
    detailAction() {
        return this.display('detail');
    }

    registerAction() {
        return this.display('register');
    }
}