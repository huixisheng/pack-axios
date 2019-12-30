```
import HttpService from 'pack-axios';
import router from 'src/routers';
import { setToken, getToken } from 'src/utils/auth';

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isString(o) {
  return typeof o === 'string';
}

const service = new HttpService({
  timeout: 15000,
  before(config) {
    // TODO 默认支持jwt，其他请根据具体需求修改
    const token = getToken();
    if (token) {
      config.headers['authorization'] = token || '';
    }
    return config;
  },
  success(response) {
    const authorization = response.headers.authorization;
    // TODO 后台接口可能存在问题
    if (authorization && authorization.length > 'Bearer '.length) {
      setToken(authorization);
    }
    // // TODO 请注意使用后台接口返回。初始环境用于模拟jwt
    // if (process.env.NODE_ENV === 'development') {
    //   setToken(true);
    // }
    const data = response.data;
    // TODO 接口返回要登录的情况统一处理，调整到登录页面
    // const code = data.code;
    // if (code === 10100 || code === 10090 || code === 10140 || code === 10130) {
    //   // 登录
    //   if (code === 10100) {
    //     window.location.href = '/vem/index';
    //   }
    // }
    // TODO 后台返回内容处理
    if (data.status === 1) {
      return data;
    }
    return Promise.reject(data);
  },
  // 如果参数是error为没有定义？很奇怪 TODO
  error(arg) {
    // {"config":{"transformRequest":{},"transformResponse":{},"timeout":10000,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/x-www-form-urlencoded","authorization":"true"},"method":"get","url":"/v1/docs-list11","params":{},"cancelToken":{"promise":{}},"data":""},"request":{},"response":{"data":{"error":"Not Found"},"status":404,"statusText":"Not Found","headers":{"date":"Thu, 16 Aug 2018 15:17:30 GMT","rate-limit-reset":"1534432651","server":"Tengine","rate-limit-total":"2","x-powered-by":"Express","vary":"Accept, Origin","content-type":"application/json; charset=utf-8","rate-limit-remaining":"1","connection":"close","content-length":"21","x-request-id":"46d576a3-ec5b-4541-b311-e5720b7e77ff"},"config":{"transformRequest":{},"transformResponse":{},"timeout":10000,"xsrfCookieName":"XSRF-TOKEN","xsrfHeaderName":"X-XSRF-TOKEN","maxContentLength":-1,"headers":{"Accept":"application/json, text/plain, */*","Content-Type":"application/x-www-form-urlencoded","authorization":"true"},"method":"get","url":"/v1/docs-list11","params":{},"cancelToken":{"promise":{}},"data":""},"request":{}}}
    // eslint-disable-next-line
    if (arg.response && (arg.response.status >= 400 || arg.response.status < 200)) {
      fundebug.notify('axiosError', 'request fail', {
        metaData: {
          url: arg.config.url,
        },
      });
      // console.error('接口请求失败: %s', arg.config.url);
      return Promise.reject({
        msg: '出错啦，请联系我们',
      });
    }
    // TODO 返回统一
    return Promise.reject(arg);
  },
});

export default class Model {
  constructor(urls, httpService = service) {
    this.urls = urls;
    this.service = httpService;
    this.list = {};
    this.init();
  }

  init() {
    const urls = this.urls;
    const list = this.list;
    // TODO:
    Object.entries(urls).forEach(([key, value]) => {
      let method = 'GET';
      let url;
      if (isObject(value)) {
        method = (value.method || 'GET').toUpperCase();
        url = value.url;
      } else if (isString(value)) {
        url = value;
      }
      const methodParamsKey = method === 'POST' ? 'data' : 'params';
      // TODO key 转换
      list[key] = {
        method,
        methodParamsKey,
        url,
      };
    });
  }

  run(modelName, params) {
    const httpService = this.service;
    const modelNameItem = this.list[modelName];
    const serviceParams = {
      url: modelNameItem.url,
      method: modelNameItem.method,
    };
    serviceParams[modelNameItem.methodParamsKey] = params;
    return new Promise((resolve, reject) => {
      httpService(serviceParams).then((data) => {
        resolve(data);
      }).catch((error) => {
        // TODO: cancelToken
        if (error && error.status !== 0 && error.message !== 'cancelToken') {
          fundebug.notifyError(error, {
            metaData: {
              data: error,
              apiModel: 'httpServiceCancelToken',
            },
          });
        }
        if (!(error && error.message === 'cancelToken')) {
          console.error('error');
          console.dir(error);
          reject(error);
        }
      });
    });
  }

  addModel() {
    // TODO
  }
}
```

```
// require('es6-promise').polyfill();
// (function (global) {
//   // 安卓4.4 不支持promise
//   // TODO: 传参支持？
//   if (!global.Promise) { // Promise polyfill
//     require('es6-promise/auto'); // eslint-disable-line
//   }
// })(typeof window !== 'undefined' ? window : global);

```