'use strict';
import Base from './base.js';
var path = require('path');
var fs = require('fs');

export default class extends Base {
    async __before() {
            this.userInfo = await this.session('userInfo');
            if (this.userInfo) {
                this.assign('user', this.userInfo);
                return Promise.resolve();
            }
            this.redirect('/admin/admin/index');
            return Promise.reject('Required login --> redirecting.');
        }
        /**
         * index action
         * @return {Promise} []
         */
    async indexAction() {
        let activityModel = this.model('activity');
        let data = think.extend({}, this.get(), this.post());
        let page = data.page || 1;
        let pageSize = data.pageSize || 10;
        let result = await activityModel.getListByPage(page, pageSize);
        result.data.forEach((value) => {
            value.startTime = think.datetime(new Date(value.startTime * 1), 'YYYY-MM-DD');
            value.endTime = think.datetime(new Date(value.endTime * 1), 'YYYY-MM-DD');
            value.createTime = think.datetime(new Date(value.createTime * 1), 'YYYY-MM-DD');
        });
        this.assign({
            data: {
                activityData: result
            }
        });
        console.log(result);
        return this.display();
    }

    tongjiAction() {
        return this.display('tongji');
    }

    changeAction() {
        return this.display('change');
    }

    loginAction() {
        return this.display('login');
    }

    addactivityAction() {
        return this.display('addactivity');
    }

    /**
     * 登录
     */
    userloginAction() {
        this.json({
            errno: 0,
            errmsg: '登录成功成功',
            data: {

            }
        });
    }

    /**
     * 添加活动
     * /admin/index/activity_add
     *
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
     * 活动状态修改
     * /admin/index/modify_activity_status
     */
    async modifyActivityStatusAction() {
        let data = this.post();
        let id = data.id;
        let status = data.status;
        let model = this.model('activity');
        let updateEffectRows = 0;
        if (status == 1) {
            // 上线活动
            updateEffectRows = await model.onLineActivity(id);
        } else {
            updateEffectRows = await model.offlineActivity(id);
        }
        if (updateEffectRows === 1) {
            this.json({
                errno: 0,
                errmsg: '更新成功',
                data: {}
            });
        } else {
            this.fail('OFF_LINE_ACTIVITY_ERROR');
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
            let status = data.status;
            let result = await model.userSetStatus(userId, status);

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

    /**
     * 管理后台 参与者列表
     */
    async participatorAction() {
        let model = this.model('home/participator');
        var data = think.extend({}, this.get(), this.post());
        console.log(data);
        let result = await model.getParticatorListByPage(data['page'] || 1);
        result.data.forEach(function(element) {
            element.joinTime = think.datetime(new Date(element.joinTime * 1), 'YYYY-MM-DD');
        });
        this.assign({
            data: {
                userList: result,
            }
        });
        this.display('participator');
    }

    exportExcelAction() {
        var nodeExcel = require('excel-export');
        var conf = {};
        // conf.stylesXmlFile = "styles.xml";
        conf.name = "mysheet";
        conf.cols = [{
            caption: '姓名',
            type: 'string',
            beforeCellWrite: function(row, cellData) {
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

    /**
     * 上传图片接口
     * /admin/index/upload_image
     */
    uploadImageAction() {
        //这里的 key 需要和 form 表单里的 name 值保持一致
        // try {
            var file = think.extend({}, this.file('file'));
            var filepath = file.path;
            //文件上传后，需要将文件移动到项目其他地方，否则会在请求结束时删除掉该文件
            var uploadPath = think.RESOURCE_PATH + '/staticimgs';
            think.mkdir(uploadPath);
            var basename = path.basename(filepath);
            fs.renameSync(filepath, uploadPath + '/' + basename);
            file.path = uploadPath + '/' + basename;
            // if (think.isFile(file.path)) {
            //     console.log('is file')
            // } else {
            //     console.log('not exist')
            // }
            this.assign('fileInfo', file);
            this.json({
                url: '/staticimgs/' + basename
            });
        // } catch (error) {
            // this.fail('UPLOAD_IAMGE_ERROR');
        // }
    }

}