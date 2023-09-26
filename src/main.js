import Cookies from 'js-cookie';
import init from './init';

import 'virtual:svg-icons-register';

init().then((res) => {
  const { app, store, router } = res;

  router.isReady().then(async () => {
    // await getHeaders(store);
    app.mount('#app');
  });
});
