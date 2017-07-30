'use strict';
/**
 * model
 */
export default class extends think.model.base {
    async addParticipator(participatorInfo) {
        let insertId =  await this.add({
            userId: participatorInfo.openId,
            parendId: participatorInfo.parendId,
            activityId: participatorInfo.activityId,
            status: 0,
            joinTime: Date.now()
        });
        return insertId;
    }


    async userSupportors(parendId, activityId,openId) {
        return await this.join({
            table: 'user',
            join: 'inner', //join 方式，有 left, right, inner 3 种方式
            as: 'userinfo', // 表别名
            on: ['userId', 'userId'] //ON 条件
        }).where({
            'userinfo.userId': ['=', openId],
            parendId: ['=', parendId]
        }).field('userinfo.userId,status,nickName,joinTime').select();
    }
     
}