'use strict';
import Base from './base.js';

export default class extends Base {
    async __before() {
        this.userInfo = await this.session('userInfo');
        if (this.userInfo) {
            this.assign('user', this.userInfo);
            return Promise.resolve();
        }
        this.redirect('/admin/user/index');
        return Promise.reject('Required login --> redirecting.');
    }   
    /**
     * index action
     * @return {Promise} []
     */
    async indexAction() {
        //auto render template file index_index.html
        let userInfo = await this.session('userInfo');
        if (userInfo) {
            return this.display();
        } else {
            this.redirect('/admin/user/index');
        }
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
                data: {
                    activityId: insertId
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
            let model = this.model('activity');
            let result = await model.getListByPage(pageNum, pageSize);
            this.json({
                errno: 0,
                data: result
            });
        } catch (error) {
            this.fail(error.message);
        }
    }

    /**
     * 根据手机号获取参与用户信息数据
     * admin/index/user_phone
     */
    async userPhoneAction() {
        try {
            let model = this.model('home/participator');
            let data = this.post();
            let phone = data.phone;
            let result = await model.getUserByPhone(phone);
            this.json(result);
        } catch (error) {
            this.fail(error.message);
        }
    }

    /**
     * 更改参与者的状态
     * /admin/index/user_set_status
     */
    async userSetStatusAction() {
        try {
            let model = this.model('home/participator');
            let data = this.post();
            let userId = data.userId;
            let result = await model.userSetStatus(userId, 1);
            this.json(result);
        } catch (error) {
            this.fail(error.message);
        }
    }

    /**
     * download excel
     */
    downAction() {
        var file = fs.readFileSync(__dirname + '/test.xlsx');
        var filePath = __dirname + '/aaa.xlsx';
        var filePath = __dirname + '/test.xlsx';
        // this.download(fileName);
        // this.download(filePath, 'application/vnd.ms-excel');
        // application/vnd.openxmlformats
        // this.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        this.download(filePath);

        // this.json({aa:111})
    }

     exportExcelAction() {
        var nodeExcel = require('excel-export');
        var conf = {};
        // conf.stylesXmlFile = "styles.xml";
        conf.name = "mysheet";
        conf.cols = [{
            caption: '姓名',
            type: 'string',
            beforeCellWrite: function (row, cellData) {
                return cellData;
            },
            width: 28.7109375
        }, {
            caption: '日期',
            type: 'string',
        }, {
            caption: '布尔',
            type: 'string'
        }, {
            caption: '数字',
            type: 'string'
        }];
        conf.rows = [
            ['张三', '2017-08-20', '是', 2004],
            ["张三-1", '2017-08-20', '是', 27182],
            ["张三-2", '2017-08-20', '是', 161803],
            ["张三-3", '2017-08-20', , '是', 1414]
        ];
        var result = nodeExcel.execute(conf);
        var res = this.http.res;
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
        res.end(result, 'binary');
    }

}