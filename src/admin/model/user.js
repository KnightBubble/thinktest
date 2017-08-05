'use strict';
/**
 * model
 */
export default class extends think.model.base {
    /**
     * 数据表字段定义
     * @type {Object}
     */
    schema = {
        signTime: {
            default: () => {
                return Date.now();
            }
        }
    }
    async getList() {
        let data = await this.field('userId,userName').where({
            userId: ['>', 0]
        }).order('userId DESC').select();
        console.log(data);
        return data;
    }

    async getUserListByPage(page, pageSize) {
        // let model = this.model('activity');
        let data = await this.page(page || 1, pageSize || 10).countSelect();
        return data;
    }

    getUserByOpenid(openid) {
        return this.where({
            openid: openid
        }).find();
    }
}