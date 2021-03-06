'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
    /**
     * index action logic
     * @return {} []
     */
    indexAction() {

    }

    /**
     * 添加活动
     */
    activityAddAction() {
        this.allowMethods = 'post';
        let rules = {
            title: {
                required: true,
                string: true
            },
            picUrl: {
                required: true,
                string: true
            },
            shareTitle: 'string',
            shareIcon: 'string'
        };
        let flag = this.validate(rules);
        if (!flag) {
            return this.fail('数据校验错误', this.errors());
        }
    }

    /**
     * /admin/index/modify_activity_status
     *
     */

    modifyActivityStatusAction() {
        this.allowMethods = 'post';
        let rules = {
            id: {
                required: true
            },
            status: {
                required: true
            }
        };
        let flag = this.validate(rules);
        if (!flag) {
            return this.fail('数据校验错误', this.errors());
        }
    }

    /**
     * 活动列表
     */
    async activityListAction() {
        this.allowMethods = ['post', 'get'];
    }

    /**
     * 根据手机号获取参与用户信息数据
     * admin/index/user_phone
     */
    userPhoneAction() {
        this.allowMethods = ['post', 'get'];
        let rules = {
            phone: {
                required: true
            }
        };
        let flag = this.validate(rules);
        if (!flag) {
            this.fail('数据校验错误', this.errors());
        }
    }


    /**
     * 更改参与者的状态
     * /admin/index/user_set_status
     */
    async userSetStatusAction() {
        this.allowMethods = ['post', 'get'];
        let rules = {
            userId: {
                required: true
            },
            status: {
                required: true
            }
        };
        let flag = this.validate(rules);
        if (!flag) {
            this.fail('数据校验错误', this.errors());
        }
    }


    /**
     * 根据活动id，获取活动的参与者
     * /admin/index/activity_user_list
     */
    async activityUserListAction() {
        this.allowMethods = ['post', 'get'];
        let rules = {
            activityId: {
                required: true
            }
        };
        let flag = this.validate(rules);
        if (!flag) {
            this.fail('数据校验错误', this.errors());
        }
    }


    async userInfoAction() {
        this.allowMethods = ['post', 'get'];
        let rules = {
            userId: {
                required: true
            }
        };
        let flag = this.validate(rules);
        if (!flag) {
            this.fail('数据校验错误', this.errors());
        }
    }

}
