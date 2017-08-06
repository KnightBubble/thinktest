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

    joinAction() {
        this.allowMethods = 'post';
        let rules = {
            activityId: {
                required: true,
                string: true
            },
            userName: {
                required: true,
                string: true
            },
            code: {
                required: true,
                string: true
            }
        };
        let flag = this.validate(rules);
        if (!flag) {
            return this.fail('数据校验错误', this.errors());
        }
    }

    /**
     * 短信发送接口
     * /home/index/sms
     */
    smsAction() {
        this.allowMethods = 'post';
        let rules = {
            phone: {
                required: true
            }
        };
        let flag = this.validate(rules);
        if (!flag) {
            return this.fail('数据校验错误', this.errors());
        }
    }

    /**
     * 获取当前用户的助力者
     */
    userSupportAction() {
        this.allowMethods = 'post';
        let rules = {
            activityId: {
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

    activityListAction
}