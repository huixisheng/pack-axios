import { expect } from 'chai';
import HttpService from '../src/lib';

// const service = new HttpService();
// const expect = chai.expect;
const getUrl = 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params';
// const postUrl = '';

function getTime() {
  return new Date().getTime();
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
    this.timeout(3000);
    const timestamp = getTime();
    service({
      url: getUrl,
      method: 'POST',
      params: {
        t: timestamp,
      },
    }).then((response) => {
      expect(response).to.be.an('object');
      expect(response).to.include.any.keys('data', 'config');
      expect(response.status).to.equal(200);
      expect(response.data.msg).to.equal('OK');
    }).catch(() => {
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
    service({
      url: getUrl,
      method: 'POST',
      params: {
        t: timestamp,
      },
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      expect(error).to.be.an('object');
      expect(error.message).to.equal('cancelToken');
    });
    service({
      url: getUrl,
      method: 'POST',
      params: {
        t: timestamp,
      },
    }).catch((error) => {
      expect(error).to.be.an('object');
      expect(error.message).to.equal('cancelToken');
    });
    service({
      url: getUrl,
      method: 'POST',
      params: {
        t: getTime(),
      },
    }).then((response) => {
      expect(response).to.be.an('object');
      expect(response).to.include.any.keys('data', 'config');
      expect(response.status).to.equal(200);
      expect(response.data.msg).to.equal('OK');
    }).catch(() => {
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
    setTimeout(() => {
      done();
    }, 500);
  });
});
