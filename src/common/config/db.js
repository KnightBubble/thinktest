'use strict';
/**
 * db config
 * @type {Object}
 */
export default {
  type: 'mysql',
  connectionLimit: 10, //建立 10 个连接
  log_sql: true, //是否记录 sql 语句
  log_connect: true, // 是否记录连接数据库的信息
  adapter: {
    mysql: {
      host: '127.0.0.1',
      port: '3306',
      database: 'marketing',
      user: 'root',
      password: 'root',
      prefix: '',
      encoding: 'utf8'
    },
    mongo: {

    }
  }
};