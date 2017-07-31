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
            descption: {
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
     * 活动下线
     */
    activityOffAction() {
        this.allowMethods = 'post';
        let rules = {
            id: {
                required: true
            }
        };
        let flag = this.validate(rules);
        if (!flag) {
            return this.fail('数据校验错误', this.errors());
        }
    }

    /**
     * 活动上线
     */
    activityOnAction() {
        this.allowMethods = 'post';
        let rules = {
            id: {
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
            }
        };
        let flag = this.validate(rules);
        if (!flag) {
            this.fail('数据校验错误', this.errors());
        }
    }

}