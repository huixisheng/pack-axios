import { optionsUrl } from './url';
import HttpService from '../src/lib';

let udid = 0;
function optionsTime() {
  return ++udid;
}

interface responseData {
  code: number;
  msg: string;
  data: any;
}

describe('instance options', function () {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService();
  });

  afterAll(() => {
    httpService = null;
  });

  test('options请求', (done) => {
    if (!httpService) return;
    httpService.options<responseData>(optionsUrl, {
      t: optionsTime(),
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

  test('去除多个重复的options请求', (done) => {
    if (!httpService) return;
    const timestamp = optionsTime();
    httpService.options<responseData>(optionsUrl, {
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
    httpService.options<responseData>(optionsUrl, {
      t: timestamp,
    }).then(() => {

    }).catch((error) => {
      console.log(error);
      expect(typeof error).toBe('object');
      expect(error.message).toEqual('requestAbort');
    });
  });
});

describe('instance options async', () => {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService({
      didRequestRepeat: true,
    });
  });

  afterAll(() => {
    httpService = null;
  });

  test('options请求', async () => {
    if (!httpService) return;
    const response = await httpService.options<responseData>(optionsUrl, { t: optionsTime() });
    expect(typeof response).toBe('object');
    expect(response).toHaveProperty('data');
    expect(response).toHaveProperty('msg');
    expect(response.code).toEqual(200);
  });

  const timestamp = optionsTime();
  test('去除多个重复的options请求', async () => {
    if (!httpService) return;
    try {
      const res = await httpService.options<responseData>(optionsUrl, { t: timestamp });
      const response = res;
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('data');
      expect(response).toHaveProperty('msg');
      expect(response.code).toEqual(200);
      const res1 = await httpService.options<responseData>(optionsUrl, { t: timestamp });
      console.log('---aa--', res1);
      expect(true).toEqual(false);
    } catch (error) {
      const response = error;
      expect(typeof response).toBe('object');
      expect(response).toHaveProperty('message');
      expect(response.message).toEqual('requestAbort');
    }
  });
});
