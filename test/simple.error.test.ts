import { AxiosError } from 'axios';
import HttpService from '../src/lib';

let udid = 0;
function getTime() {
  return ++udid;
  // return new Date().getTime() + new Date().getMilliseconds();
}

jest.setTimeout(10 * 1000);
// http://cn.voidcc.com/question/p-hiahtdcz-un.html
// https://stackoverflow.com/questions/49096093/how-do-i-test-a-jest-console-log
// https://stackoverflow.com/questions/44344801/how-to-use-jest-with-jsdom-to-test-console-log
global.console.log = jest.fn();

describe('错误 request', function () {
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService();
  });

  afterAll(() => {
    httpService = null;
  });

  test('错误 request->post请求', (done) => {
    if (!httpService) return;
    httpService.service({
      url: 'https://xx.yy',
      method: 'POST',
      params: {
        t: getTime(),
      },
    }).then(() => {
      // done();
    }).catch((error) => {
      // { Error: timeout of 5000ms exceeded
      //   at createError (/Users/huixisheng/Workspaces/Export/@x-scaffold/pack-axios/node_modules/axios/lib/core/createError.js:16:15)
      //   at handleRequestTimeout (/Users/huixisheng/Workspaces/Export/@x-scaffold/pack-axios/node_modules/axios/lib/adapters/http.js:252:16)
      //   at Timeout.callback (/Users/huixisheng/Workspaces/Export/@x-scaffold/pack-axios/node_modules/jsdom/lib/jsdom/browser/Window.js:678:19)
      //   at ontimeout (timers.js:436:11)
      //   at tryOnTimeout (timers.js:300:5)
      //   at listOnTimeout (timers.js:263:5)
      //   at Timer.processTimers (timers.js:223:10)
      // config:
      //  { url: 'https://xx.yy',
      //    method: 'post',
      //    params: { t: 1 },
      //    headers:
      //     { Accept: 'application/json, text/plain, */*',
      //       'Content-Type': 'application/x-www-form-urlencoded',
      //       'User-Agent': 'axios/0.19.0' },
      //    transformRequest: [ [Function] ],
      //    transformResponse: [ [Function: transformResponse] ],
      //    timeout: 5000,
      //    adapter: [Function: httpAdapter],
      //    xsrfCookieName: 'XSRF-TOKEN',
      //    xsrfHeaderName: 'X-XSRF-TOKEN',
      //    maxContentLength: -1,
      //    validateStatus: [Function: validateStatus],
      //    cancelToken: CancelToken { promise: [Promise] },
      //    data: '' },
      // code: 'ECONNABORTED',
      // request:
      //  Writable {
      //    _writableState:
      //     WritableState {
      //       objectMode: false,
      //       highWaterMark: 16384,
      //       finalCalled: false,
      //       needDrain: false,
      //       ending: false,
      //       ended: false,
      //       finished: false,
      //       destroyed: false,
      //       decodeStrings: true,
      //       defaultEncoding: 'utf8',
      //       length: 0,
      //       writing: false,
      //       corked: 0,
      //       sync: true,
      //       bufferProcessing: false,
      //       onwrite: [Function: bound onwrite],
      //       writecb: null,
      //       writelen: 0,
      //       bufferedRequest: null,
      //       lastBufferedRequest: null,
      //       pendingcb: 0,
      //       prefinished: false,
      //       errorEmitted: false,
      //       emitClose: true,
      //       autoDestroy: false,
      //       bufferedRequestCount: 0,
      //       corkedRequestsFree: [Object] },
      //    writable: true,
      //    _events:
      //     [Object: null prototype] {
      //       response: [Function: handleResponse],
      //       error: [Function: handleRequestError] },
      //    _eventsCount: 2,
      //    _maxListeners: undefined,
      //    _options:
      //     { protocol: 'https:',
      //       maxRedirects: 21,
      //       maxBodyLength: 10485760,
      //       path: '/?t=1',
      //       method: 'POST',
      //       headers: [Object],
      //       agent: undefined,
      //       auth: undefined,
      //       hostname: 'xx.com',
      //       port: null,
      //       nativeProtocols: [Object],
      //       pathname: '/',
      //       search: '?t=1' },
      //    _redirectCount: 0,
      //    _redirects: [],
      //    _requestBodyLength: 0,
      //    _requestBodyBuffers: [],
      //    _onNativeResponse: [Function],
      //    _currentRequest:
      //     ClientRequest {
      //       _events: [Object],
      //       _eventsCount: 6,
      //       _maxListeners: undefined,
      //       output: [],
      //       outputEncodings: [],
      //       outputCallbacks: [],
      //       outputSize: 0,
      //       writable: true,
      //       _last: true,
      //       chunkedEncoding: false,
      //       shouldKeepAlive: false,
      //       useChunkedEncodingByDefault: true,
      //       sendDate: false,
      //       _removedConnection: false,
      //       _removedContLen: false,
      //       _removedTE: false,
      //       _contentLength: 0,
      //       _hasBody: true,
      //       _trailer: '',
      //       finished: true,
      //       _headerSent: true,
      //       socket: [TLSSocket],
      //       connection: [TLSSocket],
      //       _header:
      //        'POST /?t=1 HTTP/1.1\r\nAccept: application/json, text/plain, */*\r\nContent-Type: application/x-www-form-urlencoded\r\nUser-Agent: axios/0.19.0\r\nHost: xx.com\r\nConnection: close\r\nContent-Length: 0\r\n\r\n',
      //       _onPendingData: [Function: noopPendingOutput],
      //       agent: [Agent],
      //       socketPath: undefined,
      //       timeout: undefined,
      //       method: 'POST',
      //       path: '/?t=1',
      //       _ended: false,
      //       res: null,
      //       aborted: 1577623020335,
      //       timeoutCb: null,
      //       upgradeOrConnect: false,
      //       parser: [HTTPParser],
      //       maxHeadersCount: null,
      //       _redirectable: [Circular],
      //       [Symbol(isCorked)]: false,
      //       [Symbol(outHeadersKey)]: [Object] },
      //    _currentUrl: 'https://xx.yy/?t=1' },
      // response: undefined,
      // isAxiosError: true,
      // toJSON: [Function] }
      expect(typeof error).toBe('object');
      expect(error).toHaveProperty('response');
      expect(error).toHaveProperty('config');
      done();
    });
  });
});


describe('错误 request 初始化 requestError', function () {
  // jest.setTimeout(6 * 1000);
  let httpService:HttpService|null;

  beforeAll(() => {
    httpService = new HttpService({
      silent: true,
      requestError(error: AxiosError) {
        console.log('requestError');
        return Promise.reject(error);
      },
    });
  });

  afterAll(() => {
    httpService = null;
  });

  test('错误 request 初始化 requestError->post请求', (done) => {
    if (!httpService) return;
    httpService.service({
      url: 'https://xx.yy',
      method: 'POST',
      params: {
        t: getTime(),
      },
    }).then(() => {
      // console.log(res);
      // done();
    }).catch((error) => {
      expect(typeof error).toBe('object');
      expect(error).toHaveProperty('response');
      expect(error).toHaveProperty('config');
      // expect(global.console.log).toHaveBeenNthCalledWith(1, 'interceptors.response.error');
      expect(global.console.log).toHaveBeenCalled();
      expect(global.console.log).toHaveBeenNthCalledWith(2, 'requestError');
      done();
    });
  });
});