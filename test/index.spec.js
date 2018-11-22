import { expect } from 'chai';
import { getUrl } from './url';
import HttpService from '../src/lib';

let udid = 0;
function getTime() {
  return ++udid;
  // return new Date().getTime() + new Date().getMilliseconds();
}

describe('get request', function () {
  let service = null;

  before(() => {
    service = new HttpService();
  });

  after(() => {
    service = null;
  });

  it('get请求', function (done) {
    service({
      url: getUrl,
      method: 'GET',
      params: {
        t: getTime(),
      },
    }).then((response) => {
      // console.log(response.config.params.t);
      expect(response).to.be.an('object');
      expect(response).to.include.any.keys('data', 'config');
      expect(response.status).to.equal(200);
      expect(response.data.msg).to.be.a('string');
      expect(response.data.data.method).to.equal('get');
      done();
    }).catch((error) => {
      console.log(error);
      // done();
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
  });

  it('去除多个重复的get请求', function (done) {
    // https://github.com/mochajs/mocha/issues/2025
    // https://github.com/mochajs/mocha/issues/2958
    this.timeout(10000);
    const timestamp = getTime();
    console.log('timestamp:', timestamp);
    service({
      url: getUrl,
      method: 'GET',
      params: {
        t: timestamp,
      },
    }).then((response) => {
      expect(response).to.be.an('object');
      expect(response).to.include.any.keys('data', 'config');
      expect(response.status).to.equal(200);
      expect(response.data.msg).to.be.a('string');
      expect(response.data.data.method).to.equal('get');
    }).catch((error) => {
      expect.fail(error);
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
    service({
      url: getUrl,
      method: 'GET',
      params: {
        t: timestamp,
      },
    }).then((response) => {
      expect.fail(response);
    }).catch((error) => {
      expect(error).to.be.an('object');
      expect(error.message).to.equal('cancelToken');
    });
    service({
      url: getUrl,
      method: 'GET',
      params: {
        t: timestamp,
      },
    }).then((response) => {
      expect.fail(response);
    }).catch((error) => {
      expect(error).to.be.an('object');
      expect(error.message).to.equal('cancelToken');
    });
    const t1 = getTime();
    console.log('t1:', t1);
    service({
      url: getUrl,
      method: 'GET',
      params: {
        t: t1,
      },
    }).then((response) => {
      // console.log(response);
      expect(response).to.be.an('object');
      expect(response).to.include.any.keys('data', 'config');
      expect(response.status).to.equal(200);
      expect(response.data.msg).to.be.a('string');
      expect(response.data.data.method).to.equal('get');
    }).catch((error) => {
      // console.dir(error);
      expect.fail(error);
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
    setTimeout(() => {
      done();
    }, 8000);
  });
});
