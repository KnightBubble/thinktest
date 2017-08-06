'use strict';
/**
 * model
 */
export default class extends think.model.base {
    async addParticipator(participatorInfo) {
        let insertId = await this.thenAdd({
            userId: participatorInfo.openId,
            parentId: participatorInfo.parentId,
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

    async getParticatorListByPage(pageNum = 1) {
        return await this.join({
            table: 'user',
            join: 'inner', //join 方式，有 left, right, inner 3 种方式
            as: 'userinfo', // 表别名
            on: ['userId', 'userId'] //ON 条件
        }).field('userinfo.userId,status,nickName,userName,joinTime,phone').page(pageNum, 10).countSelect();
    }

    async userSupportors(userId, activityId) {
        return await this.join({
            table: 'user',
            join: 'inner', //join 方式，有 left, right, inner 3 种方式
            as: 'userinfo', // 表别名
            on: ['userId', 'userId'] //ON 条件
        }).where({
            parentId: ['=', userId]
        }).field('userinfo.userId,userinfo.uerPortrait,status,nickName,joinTime').select();
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