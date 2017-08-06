'use strict';
/**
 * config
 */
export default {
    //key: value
    //   default_module: 'home'
    route_on: true,
    resource_on: true, //是否开启静态资源解析功能
    resource_reg: /^((static|staticimgs)\/|[^\/]+\.(?!js|html)\w+$)/, //判断为静态资源请求的正则
};