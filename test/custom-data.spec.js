import { expect } from 'chai';
import HttpService from '../src/lib';

// const service = new HttpService();
// const expect = chai.expect;
const getUrl = 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params';
// const postUrl = '';

function getTime() {
  return new Date().getTime();
}

describe('初始化添加默认配置', function () {
  let service = null;

  before(() => {
    service = new HttpService({
      timeout: 2000,
      before(config) {
        config.params['custom'] = 'pack-axios';
        return config;
      },
      success(response) {
        // console.log('success', response);
        response.data = 'pack-axios';
        return response;
      },
      error() {
        // console.log('error', error);
        return Promise.reject({ error: 'custom-error' }); // eslint-disable-line
        // return Promise.reject(error);
      },
    });
  });

  after(() => {
    service = null;
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
      expect(response.config.params.custom).to.equal('pack-axios');
      expect(response.config.timeout).to.equal(2000);
      expect(response.data).to.equal('pack-axios');
      expect(response).to.include.any.keys('data', 'config');
      done();
    }).catch(() => {
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
  });

  it('错误的请求方式', function (done) {
    service({
      url: getUrl,
      method: 'POST',
      params: {
        t: getTime(),
      },
    }).catch((error) => {
      expect(error).to.be.an('object');
      expect(error.error).to.equal('custom-error');
      done();
    });
  });
});