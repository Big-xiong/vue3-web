/* eslint-disable no-param-reassign */
/* eslint-disable no-param-reassign */
import { createApp, onBeforeUnmount } from 'vue';
import { loadModule } from '@/utils';
import init from '@/init';

let $inst;
let mountNode;
// 创建挂载实例
const Dialog = async (opts = {}) => {
  let moduleName = opts.tpl;
  const root = document.body;
  if ($inst?._props?.tpl === moduleName && mountNode) {
    $inst.unmount();
    $inst = null;
    root.removeChild(mountNode);
    mountNode = null;
  }

  if (!moduleName?.endsWith('.vue')) {
    moduleName = `/src/components/Dialog/${moduleName}.vue`;
  }

  const tpl = await loadModule(moduleName);
  mountNode = document.createElement('div');

  root.appendChild(mountNode);

  const instance = createApp(tpl.default, {
    ...opts,
    modelValue: true,
    unmount() {
      instance.unmount();
      $inst = null;
      root.removeChild(mountNode);
    },
  });

  init(instance);

  // Fix constants挂载为异步操作，加入到下一次宏任务队列，以保证可以拿到
  setTimeout(() => {
    const global = Object.assign(instance.config.globalProperties, { $t: window.$t });
    instance.provide('global', global);
    instance.mount(mountNode);
    $inst = instance;
  });
};

export default {
  // 组件祖册
  install(app) {
    app.config.globalProperties.$dialog = Dialog;
  },
};
