
import Base from './base.js';
export default class extends Base {
    /**
     * index action
     * @return {Promise} []
     */
    indexAction() {
        this.status(404);
        return this.end();
    }
}