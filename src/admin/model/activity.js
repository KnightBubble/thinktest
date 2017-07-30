'use strict';
/**
 * model
 */
export default class extends think.model.base {
    async addOneActivity (postData) {
        return await this.add(postData);
    }
    
}