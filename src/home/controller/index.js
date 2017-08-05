'use strict';
import fs from 'fs';
import path from 'path';
import Base from './base.js';
import OAuth from 'co-wechat-oauth';

const wechatConf = think.config('wechat');
const WechatOAuthApi = new OAuth(wechatConf.appid, wechatConf.appsecret, async function (openid) {
    // 传入一个根据openid获取对应的全局token的方法
    var txt = await fs.readFile(openid + ':access_token.txt', 'utf8');
    return JSON.parse(txt);
}, async function (openid, token) {
    // 请将token存储到全局，跨进程、跨机器级别的全局，比如写到数据库、redis等
    // 这样才能在cluster模式及多机情况下使用，以下为写入到文件的示例
    // 持久化时请注意，每个openid都对应一个唯一的token!
    await fs.writeFile(openid + ':access_token.txt', JSON.stringify(token));
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
        let parrentId = this.get('parrentId');
        let callbackUrl = `${this.config('url')}/home/index/callback`;
        if (parrentId) {
            callbackUrl += `?parrentId=${parrentId}`;
        }
        let oauthUrl = WechatOAuthApi.getAuthorizeURL(callbackUrl, '', 'snsapi_userinfo');
        this.redirect(oauthUrl);
    }

    /**
     * @desc 授权回调
     */
    async callbackAction() {
        let code = this.get('code');
        let parrentId = this.get('parrentId');

        let token = await WechatOAuthApi.getAccessToken(code);
        let openid = token.data.openid;
        let userInfo = await userModel.getUserByOpenid(openid);

        if (!userInfo || !userInfo.openid) {
            userInfo = await WechatOAuthApi.getUser(openid);
            let insertId = await userModel.add({
                userId: userInfo.openid,
                openId: userInfo.openid,
                uerPortrait: userInfo.headimgurl,
                nickName: userInfo.nickname,
                parrentId: parrentId,
                wechat: JSON.stringify(userInfo),
            });
        }
        this.redirect(`/home/index/detail?parrentId=${parrentId}`);
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

    testAction() {
        return this.display('test');
    }
    uploadAction() {
        //这里的 key 需要和 form 表单里的 name 值保持一致
        var file = think.extend({}, this.file('file'));
        var filepath = file.path;
        //文件上传后，需要将文件移动到项目其他地方，否则会在请求结束时删除掉该文件
        var uploadPath = think.RESOURCE_PATH + '/staticimgs';
        think.mkdir(uploadPath);
        var basename = path.basename(filepath);
        fs.renameSync(filepath, uploadPath + '/' + basename);

        file.path = uploadPath + '/' + basename;

        if (think.isFile(file.path)) {
            console.log('is file')
        } else {
            console.log('not exist')
        }

        this.assign('fileInfo', file);

        this.json({
            uploadPath: uploadPath,
            basename: basename
        });
    }
}