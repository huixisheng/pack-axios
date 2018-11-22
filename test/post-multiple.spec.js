import { expect } from 'chai';
import { postUrl } from './url';
import HttpService from '../src/lib';

let udid = 0;
function getTime() {
  return ++udid;
  // return new Date().getTime() + new Date().getMilliseconds();
}

describe('POST request', function () {
  let service = null;

  before(() => {
    service = new HttpService();
  });

  after(() => {
    service = null;
  });

  it('POST多个请求获得数据，去除相同请求数据的请求', function (done) {
    // https://github.com/mochajs/mocha/issues/2025
    // https://github.com/mochajs/mocha/issues/2958
    this.timeout(10000);
    const timestamp = getTime();
    service({
      url: postUrl,
      method: 'POST',
      data: {
        t: timestamp,
      },
    }).then((response) => {
      expect(response).to.be.an('object');
      expect(response).to.include.any.keys('data', 'config');
      expect(response.status).to.equal(200);
      expect(response.data.msg).to.be.a('string');
    }).catch((error) => {
      expect.fail(error);
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
    service({
      url: postUrl,
      method: 'POST',
      data: {
        t: timestamp,
      },
    }).then((response) => {
      expect.fail(response);
    }).catch((error) => {
      expect(error).to.be.an('object');
      expect(error.message).to.equal('cancelToken');
    });
    service({
      url: postUrl,
      method: 'POST',
      data: {
        t: timestamp,
      },
    }).then((response) => {
      expect.fail(response);
    }).catch((error) => {
      expect(error).to.be.an('object');
      expect(error.message).to.equal('cancelToken');
    });

    service({
      url: postUrl,
      method: 'POST',
      data: {
        t: getTime(),
      },
    }).then((response) => {
      expect(response).to.be.an('object');
      expect(response).to.include.any.keys('data', 'config');
      expect(response.status).to.equal(200);
      expect(response.data.msg).to.be.a('string');
    }).catch((error) => {
      expect.fail(error);
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });

    setTimeout(() => {
      done();
    }, 8000);
  });
});
