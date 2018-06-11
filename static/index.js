const service = new packAxios.default(); // eslint-disable-line

service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'POST',
  data: {},
}).then((response) => {
  console.log(response);
}).catch((error) => {
  console.log(error);
});


const t1 = new Date().getTime();
console.log('t1: ', t1);
service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'GET',
  params: {
    t1,
  },
}).then((response) => {
  console.log('get1', response);

  const t4 = new Date().getTime();
  console.log('t4: ', t4);
  service({
    url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
    method: 'GET',
    params: {
      t4,
    },
  }).then((res) => {
    console.log('get1-1', res);
  }).catch((error1) => {
    console.log(error1);
  });
}).catch((error) => {
  console.log(error);
});

const t2 = new Date().getTime();
console.log('t2: ', t2);
service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'GET',
  params: {
    t2,
  },
}).then((response) => {
  console.log('get2', response);
}).catch((error) => {
  console.log(error);
});

service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'GET',
  params: {
    t2,
  },
}).then((response) => {
  console.log('get2', response);
}).catch((error) => {
  console.log(error);
});

const t3 = new Date().getTime();
console.log('t3: ', t3);
service({
  url: 'https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params',
  method: 'GET',
  params: {
    t3,
  },
}).then((response) => {
  console.log('get3', response);
}).catch((error) => {
  console.log(error);
});

// https://easy-mock.com/mock/59ba562fe0dc663341aa54c3/v1/verify-params
console.log(service);
