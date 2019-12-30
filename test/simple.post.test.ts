import { postUrl } from './url';
import HttpService from '../src/lib';

let udid = 0;
function getTime() {
  return ++udid;
  // return new Date().getTime() + new Date().getMilliseconds();
}

describe('post request', function () {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService({
      didRequestRepeat: true,
    });
  });

  afterAll(() => {
    httpService = null;
  });

  test('post请求', (done) => {
    if (!httpService) return;
    httpService.service({
      url: postUrl,
      method: 'POST',
      params: {
        t: getTime(),
      },
    }).then((response) => {
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('config');
      expect(response.status).toEqual(200);
      expect(typeof response.data.msg).toEqual('string');
      expect(response.config.method).toEqual('post');
      done();
    }).catch((error) => {
      console.log(error);
      // done();
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
  });

  test('去除多个重复的post请求', (done) => {
    if (!httpService) return;
    const timestamp = getTime();
    console.log('timestamp:', timestamp);
    httpService.service({
      url: postUrl,
      method: 'POST',
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
      url: postUrl,
      method: 'POST',
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
      url: postUrl,
      method: 'POST',
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

describe('post request 不处理重复请求', function () {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService({
      didRequestRepeat: false,
    });
  });

  afterAll(() => {
    httpService = null;
  });

  test('post请求', (done) => {
    if (!httpService) return;
    httpService.service({
      url: postUrl,
      method: 'POST',
      params: {
        t: getTime(),
      },
    }).then((response) => {
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('config');
      expect(response.status).toEqual(200);
      expect(typeof response.data.msg).toEqual('string');
      expect(response.config.method).toEqual('post');
      done();
    }).catch((error) => {
      console.log(error);
      // done();
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
  });

  test('去除多个重复的post请求', (done) => {
    if (!httpService) return;
    const timestamp = getTime();
    console.log('timestamp:', timestamp);
    httpService.service({
      url: postUrl,
      method: 'POST',
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
      // done();
    }).catch(() => {
      // expect.fail(error);
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
    httpService.service({
      url: postUrl,
      method: 'POST',
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
      // done();
    }).catch(() => {

    });
    httpService.service({
      url: postUrl,
      method: 'POST',
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
    }).catch((error) => {
      console.log(error);
    });
  });
});

describe('post request 处理重复请求', function () {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService({
      didRequestRepeat: true,
    });
  });

  afterAll(() => {
    httpService = null;
  });

  test('post请求', (done) => {
    if (!httpService) return;
    httpService.service({
      url: postUrl,
      method: 'POST',
      params: {
        t: getTime(),
      },
    }).then((response) => {
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('config');
      expect(response.status).toEqual(200);
      expect(typeof response.data.msg).toEqual('string');
      expect(response.config.method).toEqual('post');
      done();
    }).catch((error) => {
      console.log(error);
      // done();
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
  });

  test('去除多个重复的post请求', (done) => {
    if (!httpService) return;
    const timestamp = getTime();
    console.log('timestamp:', timestamp);
    httpService.service({
      url: postUrl,
      method: 'POST',
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

    });
    httpService.service({
      url: postUrl,
      method: 'POST',
      params: {
        t: timestamp,
      },
    }).then(() => {

    }).catch((error) => {
      expect(typeof error).toBe('object');
      expect(error.message).toEqual('requestAbort');
    });
    httpService.service({
      url: postUrl,
      method: 'post',
      params: {
        t: timestamp,
      },
    }).then(() => {

    }).catch((error) => {
      expect(typeof error).toBe('object');
      expect(error.message).toEqual('requestAbort');
    });
  });
});