import { expect } from 'chai';
import { getUrl, postUrl, postErrorUrl } from './url';
import HttpService from '../src/lib';

function getTime() {
  return new Date().getTime();
}

describe('初始化before', function () {
  let service = null;

  before(() => {
    service = new HttpService({
      timeout: 2000,
      before(config) {
        // console.dir(config);
        config.params = config.params || {};
        config.params['custom'] = 'pack-axios';
        return config;
      },
    });
  });

  after(() => {
    service = null;
  });

  it('get正常请求', function (done) {
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
      expect(response.data).to.an('object');
      expect(response).to.include.any.keys('data', 'config');
      expect(response.data.data.method).to.equal('get');
      done();
    }).catch((error) => {
      console.log(error);
      expect.fail(error);
      done();
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
  });

  it('错误链接', function (done) {
    service({
      url: 'xx.com',
      method: 'POST',
      data: {
        t: getTime(),
      },
    }).then((data) => {
      expect.fail(data);
      // console.log(data);
      // expect(data).to.be.an('object');
      // done();
    }).catch((error) => {
      // console.dir(error);
      expect(error).to.be.an('error');
      // expect(error.config).to.be.an('object');
      // expect(error.error).to.equal('custom-error');
      done();
    });
  });
});

describe('初始化success', function () {
  let service = null;

  before(() => {
    service = new HttpService({
      timeout: 2000,
      before(config) {
        return config;
      },
      success(response) {
        // console.log('success', response);
        if (response.data.code === 200) {
          return response.data;
        }
        return Promise.reject(response.data);
      },
      // error() {
      //   // console.log('error', error);
      //   return Promise.reject({ error: 'custom-error' }); // eslint-disable-line
      //   // return Promise.reject(error);
      // },
    });
  });

  after(() => {
    service = null;
  });

  it('正常返回接口', function (done) {
    service({
      url: postUrl,
      method: 'POST',
      data: {
        t: getTime(),
      },
    }).then((response) => {
      expect(response).to.be.an('object');
      // expect(response.config.params.custom).to.equal('pack-axios');
      // expect(response.config.timeout).to.equal(2000);
      // expect(response.data).to.equal('pack-axios');
      expect(response).to.include.any.keys('data', 'code', 'msg');
      // expect(response.data.title).to.equal('pack-axios api');
      expect(response.data.method).to.equal('post');
      done();
    }).catch((error) => {
      // console.log(error);
      expect.fail(error);
      done();
      // (node:13054) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 107): [object Object]
    });
  });

  it('异常返回接口', function (done) {
    service({
      url: postErrorUrl,
      method: 'POST',
      data: {
        t: getTime(),
      },
    }).then((data) => {
      expect.fail(data);
      done();
    }).catch((error) => {
      // console.log(error);
      expect(error).to.be.an('object');
      expect(error).to.include.any.keys('data', 'code', 'msg');
      // expect(error.data.title).to.equal('pack-axios api');
      expect(error.data.method).to.equal('post');
      done();
    });
  });
});


describe('初始化error', function () {
  let service = null;

  before(() => {
    service = new HttpService({
      timeout: 2000,
      success(response) {
        // console.log('success', response);
        if (response.data.code === 200) {
          return response.data;
        }
        return Promise.reject(response.data);
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

  // it('异常返回接口', function (done) {
  //   service({
  //     url: postErrorUrl,
  //     method: 'POST',
  //     data: {
  //       t: getTime(),
  //     },
  //   }).then((data) => {
  //     expect.fail(data);
  //   }).catch((error) => {
  //     console.log(error);
  //     expect(error).to.be.an('object');
  //     expect(error.error).to.equal('custom-error');
  //     done();
  //   });
  // });

  it('异常返回接口', function (done) {
    service({
      url: 'xx.com',
      method: 'POST',
      data: {
        t: getTime(),
      },
    }).then((data) => {
      expect.fail(data);
    }).catch((error) => {
      // console.log(error);
      expect(error).to.be.an('object');
      expect(error.error).to.equal('custom-error');
      done();
    });
  });
});
