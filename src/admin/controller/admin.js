'use strict';

import Base from './base.js';

export default class extends Base {

    /**
     * index action  用户登录页面
     * @return {Promise} []
     */
    async indexAction() {
        //auto render template file index_index.html
        let userInfo = await this.session('userInfo');
        if (userInfo) {
            return this.redirect('/admin/index/index');
        }
        else {
            this.json({
                errno: 1,
                errmsg: '未登录用户',
                username: await this.session('userInfo')
            });
        }

        // return this.display();
    }

    /**
     * 实际登陆接口
     */
    async loginAction() {
        let {
            username,
            password,
        } = this.get();
        let secPwd = md5("0801asdf2017");
        if (username && password) {
            if (username === "good" && secPwd === "2d65ab0ebc1fc3802fb89f85fb0b0fe2") {
                //console.log('login');
                // await this.session('userInfo', user);
                await this.session('userInfo', username);
                return this.redirect('/admin/index/index');
            }
        }
        return this.redirect('/admin/index/index');
    }

    /**
     * 推出登陆
     */
    async loginOutAction() {
        await this.session('userInfo', null);
        return this.redirect('/admin/admin/index');
    }

}