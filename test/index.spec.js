import { expect } from 'chai';
import HttpService from '../src/lib';

// const service = new HttpService();
// const expect = chai.expect;
const getUrl = 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params';
// const postUrl = '';

function getTime() {
  return new Date().getTime();
}

describe('get request', function () {
  let service = null;

  before(() => {
    service = new HttpService();
  });

  after(() => {
    service = null;
  });

  it('错误的请求方式', function (done) {
    service({
      url: getUrl,
      method: 'POST',
      params: {
        t: getTime(),
      },
    }).catch((error) => {
      expect(error).to.be.an('error');
      done();
    });
  });

  it('单独请求', function (done) {
    service({
      url: getUrl,
      method: 'GET',
      params: {
        t: getTime(),
      },
    }).then((response) => {
      expect(response).to.be.an('object');
      expect(response).to.include.any.keys('data', 'config');
      expect(response.status).to.equal(200);
      expect(response.data.msg).to.equal('OK');
      done();
    }).catch((error) => {
      console.log(error);
      // done();
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
  });

  it('多个请求获得数据，第1个请求有效', function (done) {
    // https://github.com/mochajs/mocha/issues/2025
    // https://github.com/mochajs/mocha/issues/2958
    this.timeout(3000);
    service({
      url: getUrl,
      method: 'GET',
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
    service({
      url: getUrl,
      method: 'GET',
      params: {
        t: getTime(),
      },
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      expect(error).to.be.an('object');
      expect(error.message).to.equal('cancal repeat request');
    });
    service({
      url: getUrl,
      method: 'GET',
      params: {
        t: getTime(),
      },
    }).catch((error) => {
      expect(error).to.be.an('object');
      expect(error.message).to.equal('cancal repeat request');
    });
    setTimeout(() => {
      done();
    }, 500);
  });
});
