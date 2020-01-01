import { getUrl, postUrlErrorCode } from './url';
import HttpService from '../src/lib';

function getTime() {
  return new Date().getTime();
}

describe('初始化 requestBefore', function () {
  let httpService:HttpService | null;

  beforeEach(() => {
    httpService = new HttpService({
      requestBefore(config) {
        // console.dir(config);
        config.params = config.params || {};
        config.params['custom'] = 'pack-axios';
        return config;
      },
    }, {
      timeout: 4000,
    });
  });

  afterEach(() => {
    httpService = null;
  });

  test('get正常请求', function (done) {
    if (!httpService) return;
    httpService.service({
      url: getUrl,
      method: 'GET',
      params: {
        t: getTime(),
      },
    }).then((response) => {
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('config');
      expect(response.status).toEqual(200);
      expect(typeof response.data.msg).toEqual('string');
      expect(response.config.method).toEqual('get');
      expect(response.config.params.custom).toEqual('pack-axios');

      done();
    }).catch((error) => {
      console.log(error);
      // done();
    });
  });
});

describe('初始化 requestSuccess 正常数据', function () {
  let httpService:HttpService | null;

  beforeEach(() => {
    httpService = new HttpService({
      requestSuccess(response) {
        if (response.data.code === 200) {
          return response.data;
        }
        return Promise.reject(response.data);
      },
    }, {
      timeout: 2000,
    });
  });

  afterEach(() => {
    httpService = null;
  });

  test('get正常请求', (done) => {
    if (!httpService) return;
    httpService.service.request({
      url: getUrl,
      method: 'GET',
      params: {
        t: getTime(),
      },
    }).then((response) => {
      // TODO: ts 提示问题
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('msg');
      done();
    }).catch((error) => {
      console.log('error', error);
      // done();
    });
  });
});

describe('初始化 requestSuccess 异常数据', function () {
  let httpService:HttpService | null;

  beforeEach(() => {
    httpService = new HttpService({
      requestSuccess(response) {
        if (response.data.code === 200) {
          return response.data;
        }
        console.log('初始化 requestSuccess 异常数据', '初始化 requestSuccess 异常数据');
        return Promise.reject(response.data);
      },
    }, {
      timeout: 2000,
    });
  });

  afterEach(() => {
    httpService = null;
  });

  test('post 正常请求 code 非200', (done) => {
    if (!httpService) return;
    httpService.service.request({
      url: postUrlErrorCode,
      method: 'POST',
      data: {
        t: getTime(),
      },
    }).then(() => {
      // done();
    }).catch((error) => {
      const response = error;
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('msg');
      expect(response).toHaveProperty('code');
      console.log('error', error);
      done();
    });
  });
});