'use strict';
/**
 * logic
 * @param  {} []
 * @return {}     []
 */
export default class extends think.logic.base {
  /**
   * index action logic
   * @return {} []
   */
  indexAction(){
   
  }

  joinAction() {
      this.allowMethods = 'post';
        let rules = {
            openId: {
                required: true,
                string: true
            },
            parendId: {
                required: true,
                string: true
            },
            activityId: {
                required: true,
                string: true
            }
        };
        let flag = this.validate(rules);
        if (!flag) {
            return this.fail('数据校验错误', this.errors());
        }
  }
}