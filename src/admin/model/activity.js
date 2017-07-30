'use strict';
/**
 * model
 */
export default class extends think.model.base {
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
    async ononLine() {

    }

    /**
     * 下线
     * status => 0
     */
    async offLine() {

    }


    async modifyActivity() {

    }

}