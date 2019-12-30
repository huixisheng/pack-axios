import axios, {
  AxiosRequestConfig, AxiosResponse, AxiosError, AxiosInstance,
} from 'axios';
import Qs from 'qs';
import Queue from './queue';
// import objectAssign from 'object-assign'; // 处理部分国产浏览不兼容Object.assign

const objectAssign = Object.assign;

interface packAxiosConfigInterface {
  /**
   * 是否打印调试信息
   */
  silent?: boolean;
  /**
   * 是否处理重复的请求
   */
  didRequestRepeat?: boolean;
  requestBefore?: (arg: AxiosRequestConfig) => AxiosRequestConfig;
  requestSuccess?: (arg: AxiosResponse) => AxiosResponse;
  requestError?: (arg: AxiosError) => AxiosError | Promise<never>;
}

const CancelToken = axios.CancelToken;
// let service;

const defaultOptions = {
  silent: false,
  didRequestRepeat: true,
};

const defaultAjaxConfig:AxiosRequestConfig = {
  // didRequestRepeat: true,
  // 处理post请求返回Payload
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  transformRequest: [function (data) {
    data = Qs.stringify(data);
    return data;
  }],
  // cancelToken: new CancelToken(function (c) {
  //   cancel = c;
  // }),
  timeout: 5 * 1000, // 请求超时时间
};

class HttpService {
  private queueInstance: Queue;

  public axiosOpts: AxiosRequestConfig;

  public options: packAxiosConfigInterface;

  public service: AxiosInstance;


  constructor(options?: packAxiosConfigInterface, axiosOpts?: AxiosRequestConfig) {
    this.options = objectAssign(defaultOptions, options || {});
    this.axiosOpts = objectAssign(defaultAjaxConfig, axiosOpts || {});
    this.queueInstance = new Queue();
    this.service = axios.create(this.axiosOpts);
    this.axiosSetup();
  }

  axiosSetup() {
    const service = this.service;
    const queueInstance = this.queueInstance;
    const options = this.options;
    const log = this.log.bind(this);

    // https://github.com/axios/axios#interceptors 拦截器
    service.interceptors.request.use((config: AxiosRequestConfig) => {
      if (options && typeof options.requestBefore === 'function') {
        config = options.requestBefore.call(service, config);
      }
      if (options.didRequestRepeat) {
        config.cancelToken = new CancelToken((c) => {
          const id = Queue.getQueueUniqueId(config);
          const item = {
            id,
            cancelRequest: c,
          };
          queueInstance.enqueue(item);
        });
      }
      return config;
    }, /* istanbul ignore next  */ (error) => {
      /* istanbul ignore next  */
      log('interceptors.request.error', error);
      /* istanbul ignore next */
      Promise.reject(error);
    });

    /* eslint consistent-return: "off" */
    service.interceptors.response.use(
      (response) => {
        queueInstance.dequeue(response.config);
        if (options && typeof options.requestSuccess === 'function') {
          return options.requestSuccess.call(service, response);
        }
        return response;
      },
      (error: AxiosError) => {
        log('interceptors.response.error', error);
        if (options && typeof options.requestError === 'function') {
          return options.requestError.call(service, error);
        }
        return Promise.reject(error);
      },
    );
  }

  log(...args: any) {
    if (this.options.silent) {
      console.log(args);
    }
  }
}


export default HttpService;