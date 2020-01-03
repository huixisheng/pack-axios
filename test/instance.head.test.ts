import { headUrl } from './url';
import HttpService from '../src/lib';

let udid = 0;
function headTime() {
  return ++udid;
}

interface responseData {
  code: number;
  msg: string;
  data: any;
}

describe('instance head', function () {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService();
  });

  afterAll(() => {
    httpService = null;
  });

  test('head请求', (done) => {
    if (!httpService) return;
    httpService.head<responseData>(headUrl, {
      t: headTime(),
    }).then((response) => {
      expect(typeof response).toBe('string');
      done();
    }).catch((error) => {
      console.log(error);
      // done();
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
  });

  test('去除多个重复的head请求', (done) => {
    if (!httpService) return;
    const timestamp = headTime();
    httpService.head<responseData>(headUrl, {
      t: timestamp,
    }).then((response) => {
      expect(typeof response).toBe('string');
      done();
      done();
    }).catch(() => {
      // expect.fail(error);
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
    httpService.head<responseData>(headUrl, {
      t: timestamp,
    }).then(() => {

    }).catch((error) => {
      console.log(error);
      expect(typeof error).toBe('object');
      expect(error.message).toEqual('requestAbort');
    });
  });
});

describe('instance head async', () => {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService({
      didRequestRepeat: true,
    });
  });

  afterAll(() => {
    httpService = null;
  });

  test('head请求', async () => {
    if (!httpService) return;
    const response = await httpService.head<responseData>(headUrl, { t: headTime() });
    expect(typeof response).toBe('string');
  });

  const timestamp = headTime();
  test('去除多个重复的head请求', async () => {
    if (!httpService) return;
    try {
      const res = await httpService.head<responseData>(headUrl, { t: timestamp });
      const response = res;
      expect(typeof response).toBe('string');
      const res1 = await httpService.head<responseData>(headUrl, { t: timestamp });
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
