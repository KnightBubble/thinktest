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
}