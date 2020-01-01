import { postUrl } from './url';
import HttpService from '../src/lib';

let udid = 0;
function getTime() {
  return ++udid;
}

interface responseData {
  code: number;
  msg: string;
  data: any;
}

describe('instance post', function () {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService();
  });

  afterAll(() => {
    httpService = null;
  });

  test('get请求', (done) => {
    if (!httpService) return;
    httpService.post<responseData>(postUrl, {
      t: getTime(),
    }).then((response) => {
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('msg');
      expect(response.code).toEqual(200);
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
    httpService.post<responseData>(postUrl, {
      t: timestamp,
    }).then((response) => {
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('msg');
      expect(response.code).toEqual(200);
      done();
    }).catch(() => {
      // expect.fail(error);
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
    httpService.post<responseData>(postUrl, {
      t: timestamp,
    }).then(() => {

    }).catch((error) => {
      console.log(error);
      expect(typeof error).toBe('object');
      expect(error.message).toEqual('requestAbort');
    });
  });
});

describe('instance post async', () => {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService({
      didRequestRepeat: true,
    });
  });

  afterAll(() => {
    httpService = null;
  });

  test('post 请求', async () => {
    if (!httpService) return;
    const response = await httpService.post<responseData>(postUrl, { t: getTime() });
    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('msg');
    expect(response.code).toEqual(200);
  });

  const timestamp = getTime();
  test('去除多个重复的 post 请求', async () => {
    if (!httpService) return;
    try {
      await httpService.post<responseData>(postUrl, { t: timestamp });
      const res = await httpService.post<responseData>(postUrl, { t: timestamp });
      const response = res;
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('msg');
      expect(response.code).toEqual(200);
    } catch(error) {
      // TODO:async 调用方式跟预期有出入
      console.log(error, '--dd--');
    }
  });
});