'use strict';
/**
 * model
 */
export default class extends think.model.base {
    /**
     * 添加活动
     * @param {* Object} postData
     * status => 0 待上线
     * status => 1 已上线
     * status => 2 已下线
     * 数据表字段定义
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
            },
            createTime: {
                default: () => {
                    return Date.now();
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
            status: 0,
        }
        console.log('----->' + postData.activityId);
        return await this.add(postData, {
            id: postData.activityId || 0
        });
    }


    /**
     * 上线
     * status => 1
     */
    async onLineActivity(id) {
        let affectedRows = await this.where({
            id: id
        }).update({
            status: 1,
            startTime: Date.now()
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
                status: 2,
                endTime: Date.now()
            });
        } catch (error) {
            console.log(error.message);
            affectedRows = 0;
        }
        return affectedRows;
    }

    /**
     * 查询活动基本数据
     */
    async getActivityInfo(activityId) {
        return await this.where({
            id: activityId
        }).find();
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
            data = this.page(pageNum, pageSize).where('status = 0 OR status = 1').countSelect();
        } catch (e) {
            console.log(e.message);
        }
        return data;
    }

    /**
     * 活动是否有效, 线上活动
     * @param {*string} activityId
     */
    async isActivityValid(activityId) {
        console.log('model isActivityValid params=>' + activityId);
        let isValid = false;
        var result = await this.where({
            id: activityId,
            status: 1
        }).find();
        if (result && result.id) {
            isValid = true;
        }
        console.log('model isActivityValid return =>' + isValid);
        return isValid;
    }

    /**
     * 活动是否有效, 线上活动
     * @param {*string} activityId
     */
    async isHasActivity(activityId) {
        console.log('model isHasActivity params=>' + activityId);
        let isHasActivityFlag = false;
        var result = await this.where({
            id: activityId
        }).find();
        if (result && result.id) {
            isHasActivityFlag = true;
        }
        console.log('model isHasActivity return =>' + isHasActivityFlag);
        return isHasActivityFlag;
    }

}