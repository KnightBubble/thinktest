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
    indexAction() {
        //auto render template file index_index.html
        return this.display();
    }

    /**
     * @desc 微信授权
     */
    wechatAction() {
        let parentId = this.get('parentId') || "";
        let artivityId = this.get('artivityId');
        let callbackUrl = `${this.config('url')}/home/index/callback?`;
        if (parentId) {
            callbackUrl += `parentId=` + parentId;
        }
        if (artivityId) {
            callbackUrl += `&artivityId=${artivityId}`;
        }
        let oauthUrl = WechatOAuthApi.getAuthorizeURL(callbackUrl, '', 'snsapi_userinfo');
        this.redirect(oauthUrl);
    }

    /**
     * @desc 授权回调
     */
    async callbackAction() {
        let code = this.get('code');
        let parentId = this.get('parentId') || '';
        let artivityId = this.get('artivityId');
        let token = await WechatOAuthApi.getAccessToken(code);
        let openid = token.data.openid;
        let cacheOpenid = await this.session('openid');
        if (!cacheOpenid) {
            let userModel = this.model('admin/user');
            let userInfo = await userModel.getUserByOpenid(openid);
            if (!userInfo || !userInfo.openId) {
                userInfo = await WechatOAuthApi.getUser(openid);
                let insertId = await userModel.add({
                    userId: userInfo.openid,
                    openId: userInfo.openid,
                    uerPortrait: userInfo.headimgurl,
                    nickName: userInfo.nickname,
                    parentId: parentId,
                    wechat: JSON.stringify(userInfo),
                });
            }
        }
        this.session('openid', openid);
        this.cookie('openId', openid);
        this.redirect(`/home/index/detail?parentId=${parentId}&artivityId=${artivityId}`);
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

    detailAction() {
        return this.display('detail');
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

    registerAction() {
        return this.display('register');
    }

    testAction() {
        return this.display('test');
    }

}