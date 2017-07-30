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
}