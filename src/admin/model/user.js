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
        
        userName: { //user_name
            default: 0 //默认为 0
        },
        userId: { //id
            default: function () {
                return '100';
            }
        },
        signTime: { //创建时间
            default: () => { //获取当前时间
                return Date.now();
                // return moment().format('YYYY-MM-DD HH:mm:ss')
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

    async getUserByOpenid(openid) {
        return this.where({openid: openid}).find();
    }
}