import { getUrl } from './url';
import HttpService from '../src/lib';

let udid = 0;
function getTime() {
  return ++udid;
  // return new Date().getTime() + new Date().getMilliseconds();
}

describe('get request', function () {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService();
  });

  afterAll(() => {
    httpService = null;
  });

  test('get请求', (done) => {
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
      done();
    }).catch((error) => {
      console.log(error);
      // done();
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
  });

  test('去除多个重复的get请求', (done) => {
    if (!httpService) return;
    const timestamp = getTime();
    console.log('timestamp:', timestamp);
    httpService.service({
      url: getUrl,
      method: 'GET',
      params: {
        t: timestamp,
      },
    }).then((response) => {
      console.log('request2 response.data', response.data);
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('config');
      expect(response.status).toEqual(200);
      expect(typeof response.data.msg).toEqual('string');
      done();
    }).catch(() => {
      // expect.fail(error);
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
    httpService.service({
      url: getUrl,
      method: 'GET',
      params: {
        t: timestamp,
      },
    }).then((response) => {
      console.log('request2 response', response);
      // expect.fail(response);
    }).catch((error) => {
      console.log(error);
      expect(typeof error).toBe('object');
      expect(error.message).toEqual('requestAbort');
    });
    httpService.service({
      url: getUrl,
      method: 'GET',
      params: {
        t: timestamp,
      },
    }).then((response) => {
      console.log('request2 response', response);
      // expect.fail(response);
    }).catch((error) => {
      console.log(error);
      expect(typeof error).toBe('object');
      expect(error.message).toEqual('requestAbort');
    });
  });
});
