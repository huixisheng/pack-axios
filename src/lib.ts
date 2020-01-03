import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  AxiosInstance,
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
  // 请求超时时间
  timeout: 5 * 1000,
};

class HttpService {
  private queueInstance: Queue;

  public axiosOpts: AxiosRequestConfig;

  public configs: packAxiosConfigInterface;

  public service: AxiosInstance;


  constructor(options?: packAxiosConfigInterface, axiosOpts?: AxiosRequestConfig) {
    this.configs = objectAssign(defaultOptions, options || {});
    this.axiosOpts = objectAssign(defaultAjaxConfig, axiosOpts || {});
    this.queueInstance = new Queue();
    this.service = axios.create(this.axiosOpts);
    this.axiosSetup();
  }

  axiosSetup() {
    const service = this.service;
    const queueInstance = this.queueInstance;
    const options = this.configs;
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
        if (options.didRequestRepeat) {
          // 特殊处理使用 await/async 重复请求处理失败
          setTimeout(() => {
            queueInstance.dequeue(response.config);
          }, 0);
        }
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
    if (this.configs.silent) {
      console.log(args);
    }
  }

  // https://github.com/axios/axios/blob/master/dist/axios.js#L561
  async get<T>(this: any, url: string, data?: any, config?: AxiosRequestConfig) {
    const res: AxiosResponse<T> = await this.service.get(url, {
      params: data,
      ...config,
    });
    return res.data;
  }

  async delete<T>(this: any, url: string, data?: any, config?: AxiosRequestConfig) {
    const res: AxiosResponse<T> = await this.service.delete(url, {
      params: data,
      ...config,
    });
    return res.data;
  }

  async head<T>(this: any, url: string, data?: any, config?: AxiosRequestConfig) {
    const res: AxiosResponse<T> = await this.service.head(url, {
      params: data,
      ...config,
    });
    return res.data;
  }

  async options<T>(this: any, url: string, data?: any, config?: AxiosRequestConfig) {
    const res: AxiosResponse<T> = await this.service.options(url, {
      params: data,
      ...config,
    });
    return res.data;
  }

  // https://github.com/axios/axios/blob/master/dist/axios.js#L571
  async post<T>(this: any, url: string, data?: any, config?: AxiosRequestConfig) {
    const res: AxiosResponse<T> = await this.service.post(url, data, config = {});
    return res.data;
  }

  async put<T>(this: any, url: string, data?: any, config?: AxiosRequestConfig) {
    const res: AxiosResponse<T> = await this.service.put(url, data, config = {});
    return res.data;
  }

  async patch<T>(this: any, url: string, data?: any, config?: AxiosRequestConfig) {
    const res: AxiosResponse<T> = await this.service.patch(url, data, config = {});
    return res.data;
  }
}

export default HttpService;
