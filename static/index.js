const service = new packAxios().service; // eslint-disable-line

// https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params
console.log('service instance', service);
console.log('service instance isCancel', service.isCancel);

// console.groupCollapsed('\n404请求');
service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'POST',
  data: {},
}).then((response) => {
  console.log(response);
}).catch((error) => {
  console.error('404请求');
  console.log(error.config);
  console.dir(error);
});

// console.info('\n递归调用请求');
const t1 = new Date().getTime();
service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'GET',
  params: {
    t1,
  },
}).then((response) => {
  console.log('t1: ', t1);
  console.log('get1', response);

  const t4 = new Date().getTime();
  service({
    url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
    method: 'GET',
    params: {
      t4,
    },
  }).then((res) => {
    console.log('t4: ', t4);
    console.log('get1-1', res);
  }).catch((error1) => {
    console.error(error1);
  });
}).catch((error) => {
  console.error(error);
});


// console.info('\n正常请求存在重复请求');
const t2 = new Date().getTime();
service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'GET',
  params: {
    t2,
  },
}).then((response) => {
  console.log('t2: ', t2);
  console.log('get2 response', response);
}).catch((error) => {
  console.error('get2 error', error);
});

service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'GET',
  params: {
    t2,
  },
}).then((response) => {
  console.log('get2 response repeat', response);
}).catch((error) => {
  console.error('get2 error repeat', error);
});


service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'GET',
  params: {
    t2,
  },
}).then((response) => {
  console.log('get2 response repeat', response);
}).catch((error) => {
  console.error('get2 error repeat', error);
});

service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'GET',
  params: {
    t2,
  },
}).then((response) => {
  console.log('get2 response repeat', response);
}).catch((error) => {
  console.error('get2 error repeat', error);
});

// console.info('\n正常请求');
const t3 = new Date().getTime();
service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'GET',
  params: {
    t3,
  },
}).then((response) => {
  console.log('t3: ', t3);
  console.log('get3 response', response);
}).catch((error) => {
  console.error('get3 error', error);
});
