'use strict';

import Base from './base.js';

export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    indexAction() {
        return this.display();
    }

    /**
     * 添加活动
     */
    async activityAddAction() {
        let postData = this.post();
        let activityModel = this.model('activity');
        let insertId = await activityModel.addOneActivity(postData);// 返回数据自增id
        if (insertId) {
            this.json({
                errno:0,
                errmsg:'添加活动成功'
            });
        }
        else {
            this.fail('ADDA_ACTIVITY_DB_ERROR');
        }
    }


    /**
     * 活动下线
     */
    async activityOffAction() {
        
    }

    /**
     * 上线活动
     */

    async activityOnAction() {
        this.json({
            name:11
        })
    }


}