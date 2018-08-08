import axios from 'axios';
import Qs from 'qs';
import objectAssign from 'object-assign'; // 处理部分国产浏览不兼容Object.assign

// require('es6-promise').polyfill();
(function (global) {
  // 安卓4.4 不支持promise
  if (!global.Promise) { // Promise polyfill
    require('es6-promise/auto'); // eslint-disable-line
  }
})(typeof window !== 'undefined' ? window : global);


class Queue {
  constructor() {
    this.list = [];
  }

  static getQueueUniqueId(item) {
    const uniqueKey = item.url + '_' + item.method + '_' + Qs.stringify(item.params);
    return uniqueKey;
  }

  enqueue(item) {
    let hasInQueue = false;
    const list = this.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const listItem = list[i];
      if (listItem.id === item.id) {
        hasInQueue = true;
        if (typeof item.cancelToken === 'function') {
          item.cancelToken('cancelToken');
        }
      }
    }
    if (!hasInQueue) {
      list.push(item);
    }
  }

  dequeue(config) {
    const uniqueKey = Queue.getQueueUniqueId(config);
    const list = this.list;
    for (let i = list.length - 1; i >= 0; i--) {
      const listItem = list[i];
      if (listItem.id === uniqueKey) {
        list.splice(i, 1);
      }
    }
  }

  clear() {
    this.list = [];
  }
}
const CancelToken = axios.CancelToken;
// let service;

function HttpService(cfg) {
  const queueInstance = new Queue();
  // if (service) {
  //   return service;
  // }

  const service = axios.create(objectAssign({
    // 处理post请求返回Payload
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    transformRequest: [function (data) {
      data = Qs.stringify(data);
      return data;
    }],
    // cancelToken: new CancelToken(function (c) {
    //   cancel = c;
    // }),
    timeout: 10000, // 请求超时时间
  }, cfg));

  // service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  // https://github.com/axios/axios#interceptors 拦截器
  service.interceptors.request.use((config) => {
    config.cancelToken = new CancelToken((c) => {
      const id = Queue.getQueueUniqueId(config);
      const item = {
        id,
        cancelToken: c,
      };
      queueInstance.enqueue(item);
    });
    if (cfg && typeof cfg.before === 'function') {
      return cfg.before.call(service, config);
    }
    return config;
  }, (error) => {
    console.log('interceptors.request', error);
    Promise.reject(error);
  });

  /* eslint consistent-return: "off" */
  service.interceptors.response.use(
    (response) => {
      queueInstance.dequeue(response.config);
      if (cfg && typeof cfg.success === 'function') {
        return cfg.success.call(service, response);
      }
      return response;
    },
    (error) => {
      if (!axios.isCancel(error)) {
        console.error('');
        console.dir(error);
      }
      if (cfg && typeof cfg.error === 'function') {
        return cfg.error.call(service, error);
      }
      // {"0":{"config":{"transformRequest":{},"transformResponse":{},"timeout":10000,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/x-www-form-urlencoded","Authorization":"Authorization"},"method":"get","url":"/api/user/info","data":"{}"},"request":{},"response":{"data":"...","status":404,"statusText":"Not Found","headers":{"date":"Wed, 16 Aug 2017 16:04:32 GMT","content-encoding":"gzip","server":"cosmeapp/2015","x-powered-by":"PHP/7.1.0","vary":"Accept-Encoding","content-type":"text/html; charset=UTF-8","access-control-allow-origin":"","cache-control":"no-cache, private","transfer-encoding":"chunked"},"config":{"transformRequest":{},"transformResponse":{},"timeout":10000,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/x-www-form-urlencoded","Authorization":"Authorization"},"method":"get","url":"/api/user/info","data":"{}"},"request":{}}}}
      // console.log('interceptors.response', error.data);
      return Promise.reject(error);
    },
  );
  return service;
}

export default HttpService;