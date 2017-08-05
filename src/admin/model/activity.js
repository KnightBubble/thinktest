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
            startTime: {
                default: () => {
                    return Date.now();
                }
            },
            status: {
                default: () => {
                    return 0;
                }
            }
        }
        /**
         * 添加活动
         * @param {* Object} postData
         */
    async addOneActivity(postData) {
        let data = {
            title: postData.title,
            descption: postData.descption,
            picUrl: postData.picUrl,
            shareTitle: postData.shareTitle,
            shareIcon: postData.shareIcon,
            startTime: postData.startTime,
            endTime: postData.endTime,
            status: 1,
        }
        return await this.add(postData);
    }


    /**
     * 上线
     * status => 1
     */
    async onLineActivity(id) {
        let affectedRows = await this.where({
            id: id
        }).update({
            status: 1
        });
        return affectedRows;
    }

    /**
     * 下线
     * status => 0
     */
    async offlineActivity(id) {
        let affectedRows;
        try {
            affectedRows = await this.where({
                id: id
            }).update({
                status: 0
            });
        } catch (error) {
            console.log(error.message);
            affectedRows = 0;
        }
        return affectedRows;
    }



    /**
     * 修改活动内容
     */
    async modifyActivity() {

    }

    /**
     * 获取活动列表带有分页
     */

    async getListByPage(pageNum = 1, pageSize = 10) {
        var data = {};
        try {
            data = this.page(pageNum, pageSize).countSelect();
        } catch (e) {
            console.log(e.message);
        }
        return data;
    }

}