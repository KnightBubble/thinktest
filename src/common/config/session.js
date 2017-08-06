'use strict';

/**
 * session configs
 */
export default {
  name: 'thinkjs',
  type: 'redis',
  secret: '*&97C6L$',
  timeout: 24 * 3600,
  cookie: { // cookie options
    length: 32,
    httponly: true
  },
  adapter: {
    file: {
      path: think.RUNTIME_PATH + '/session',
    }
  }
};