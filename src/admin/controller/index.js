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
        let insertId = await activityModel.addOneActivity(postData); // 返回数据自增id
        if (insertId) {
            this.json({
                errno: 0,
                errmsg: '添加活动成功',
                data:{
                    activityId:insertId
                }
            });
        } else {
            this.fail('ADDA_ACTIVITY_DB_ERROR');
        }
    }


    /**
     * 活动下线
     */
    async activityOffAction() {
        let data = this.post();
        let id = data.id;
        let model = this.model('activity');
        let updateEffectRows = await model.offlineActivity(id);
        if (updateEffectRows === 1) {
            this.json({
                errno: 0,
                errmsg: '上线失效成功',
                data: {}
            });
        } else {
            this.fail('OFF_LINE_ACTIVITY_ERROR');
        }

    }

    /**
     * 上线活动
     */
    async activityOnAction() {
        let data = this.post();
        let id = data.id;
        let model = this.model('activity');
        let updateEffectRows = await model.onLineActivity(id);
        if (updateEffectRows === 1) {
            this.json({
                errno: 0,
                errmsg: '上线生效成功'
            });
        } else {
            this.fail('ON_LINE_ACTIVITY_ERROR');
        }
    }


    /**
     * 活动列表
     */
    async activityListAction() {
        try {
            let pageData = this.get() || this.post();
            let pageSize = pageData.pageSize;
            let pageNum = pageData.pageNum;
            let model =  this.model('activity');
            let result = await model.getListByPage(pageNum, pageSize);
            this.json({
                errno: 0,
                data: result
            });
        }
        catch(error) {
            this.fail(error.message);
        }

    }

}