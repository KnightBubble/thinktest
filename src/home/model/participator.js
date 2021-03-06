'use strict';
/**
 * model
 */
export default class extends think.model.base {
    async addParticipator(participatorInfo) {
        let insertId = await this.thenAdd({
            userId: participatorInfo.openId,
            parentId: participatorInfo.parentId == participatorInfo.openId ? '' : participatorInfo.parentId,
            activityId: participatorInfo.activityId,
            status: 0,
            joinTime: Date.now()
        }, {
                userId: participatorInfo.openId,
                activityId: participatorInfo.activityId,
            });
        return insertId;
    }

    async isJoin(userId, activityId) {
        let isJoin = false;
        let result = await this.where({
            userId: userId,
            activityId: activityId
        }).find();
        if (result && result.userId) {
            isJoin = true;
        }
        return isJoin;

    }

    /**
     * 获取所有的参与者列表
     * @param {*} pageNum 
     */
    async getParticatorListByPage(pageNum = 1, phone = "") {
        if (phone) {
            console.log('getParticatorListByPage phone => ' + phone)
            return await this.join({
                table: 'user',
                join: 'inner', //join 方式，有 left, right, inner 3 种方式
                as: 'userinfo', // 表别名
                on: ['userId', 'userId'] //ON 条件
            }).field('userinfo.userId,status,nickName,activityId,userName,joinTime,parentId,phone').where({
                phone: phone
            }).page(pageNum, 10).countSelect();
        }
        return await this.join({
            table: 'user',
            join: 'inner', //join 方式，有 left, right, inner 3 种方式
            as: 'userinfo', // 表别名
            on: ['userId', 'userId'] //ON 条件
        }).field('userinfo.userId,status,nickName,activityId,userName,joinTime,parentId,phone').page(pageNum, 10).countSelect();
    }

    /**
     * 根据活动id获取参与者
     * @param {*string} activityId 
     */
    async getParticatorListByActivityId(activityId, pageNum = 1, pageSize = 10, startTime, endTime) {
        startTime = startTime ? +new Date(startTime) : 0;
        console.log('getParticatorListByActivityId nowTime params=>' + (new Date() * 1));
        endTime = endTime ? +new Date(endTime) : +new Date();
        console.log('getParticatorListByActivityId endTime params=>' + endTime);
        endTime += 1 * 24 * 3600 * 1000;
        console.log('getParticatorListByActivityId startTime params=>' + startTime);
        return await this.join({
            table: 'user',
            join: 'inner', //join 方式，有 left, right, inner 3 种方式
            as: 'userinfo', // 表别名
            on: ['userId', 'userId'] //ON 条件
        }).field('userinfo.userId,status,nickName,userName,joinTime,phone').where({
            activityId: activityId,
            joinTime: {
                '>=': startTime,
                '<=': endTime
            }
        }).page(pageNum, pageSize).countSelect();
    }

    async userSupportors(userId, activityId) {
        return await this.join({
            table: 'user',
            join: 'inner', //join 方式，有 left, right, inner 3 种方式
            as: 'userinfo', // 表别名
            on: ['userId', 'userId'] //ON 条件
        }).where({
            parentId: ['=', userId],
            activityId: ['=', activityId]
        }).field('userinfo.userId,userinfo.uerPortrait,status,nickName,userName,joinTime').select();
    }

    /**
     * 根据手机获取用户信息，多表查询
     * @param {*string} phone
     */
    async getUserByPhone(phone) {
        let result = {
            errno: 0,
            errmsg: "查询成功",
            data: {}
        };
        try {
            result.data = await this.join({
                table: 'user',
                join: 'inner', //join 方式，有 left, right, inner 3 种方式
                as: 'userinfo', // 表别名
                on: ['userId', 'userId'] //ON 条件
            }).where({
                phone: ['=', phone]
            }).field('userinfo.userId,status,nickName,joinTime').select();
        } catch (error) {
            result.no = 1;
            console.log(error.message);
        }
        return result;
    }

    /**
     * 更改参与者的状态
     */
    async userSetStatus(userId, status) {
        let result = {
            errno: 0,
            errmsg: "更新成功",
            data: {}
        };
        let affectedRows = 0;
        try {
            affectedRows = await this.where({
                userId: userId
            }).update({
                status: status || 0
            });
        } catch (error) {
            affectedRows = 0;
            result.errno = 1;
            result.errmsg = error.message;
            console.log('participator userSetStatus errot' + error.message);
        }
        return result;

    }

}