import axios from 'axios';
import Qs from 'qs';
import objectAssign from 'object-assign'; // 处理部分国产浏览不兼容Object.assign

// require('es6-promise').polyfill();
(function (global) {
  // 安卓4.4 不支持promise
  // TODO: 传参支持？
  if (!global.Promise) { // Promise polyfill
    require('es6-promise/auto'); // eslint-disable-line
  }
})(typeof window !== 'undefined' ? window : global);


class Queue {
  constructor() {
    this.list = [];
  }

  static getQueueUniqueId(item) {
    // fix:  POST方法是item.data
    let uniqueKey = item.url + '?method=' + item.method;
    let params = item.params;
    if (item.method.toUpperCase() === 'POST') {
      params = item.data;
    }
    let res = '';
    if (typeof params === 'string') {
      res = params;
    } else {
      res = Qs.stringify(params);
    }
    uniqueKey = uniqueKey + '&' + res;
    // console.log(uniqueKey);
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

function HttpService(options) {
  const queueInstance = new Queue();
  // if (service) {
  //   return service;
  // }
  const axiosConfig = objectAssign({
    silent: true,
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
  }, options);

  const service = axios.create(axiosConfig);
  const silent = axiosConfig.silent;

  // service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  // https://github.com/axios/axios#interceptors 拦截器
  service.interceptors.request.use((config) => {
    if (config && typeof config.before === 'function') {
      config = config.before.call(service, config);
    }
    config.cancelToken = new CancelToken((c) => {
      const id = Queue.getQueueUniqueId(config);
      // console.log('cancelToken id: ', id);
      const item = {
        id,
        cancelToken: c,
      };
      queueInstance.enqueue(item);
    });
    return config;
  }, (error) => {
    if (!silent) {
      console.error('interceptors.request.error');
    }
    Promise.reject(error);
  });

  /* eslint consistent-return: "off" */
  service.interceptors.response.use(
    (response) => {
      queueInstance.dequeue(response.config);
      if (axiosConfig && typeof axiosConfig.success === 'function') {
        return axiosConfig.success.call(service, response);
      }
      return response;
    },
    (error) => {
      // 接口404
      // if (!axios.isCancel(error)) {
      //   console.error('');
      //   console.dir(error);
      // }
      if (!silent) {
        console.error('interceptors.response.error');
      }
      if (axiosConfig && typeof axiosConfig.error === 'function') {
        return axiosConfig.error.call(service, error);
      }
      return Promise.reject(error);
    },
  );
  return service;
}

export default HttpService;