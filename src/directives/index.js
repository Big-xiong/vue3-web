import { watch, watchEffect } from 'vue';
import Cookies from 'js-cookie';
import { priceUnitTransform } from '@/utils/index';

export default (app, store) => {
  const { $t } = app.config.globalProperties;
  // 需要登录才能操作
  const checkLogin = (e) => {
    e?.stopPropagation?.();
    app.config.globalProperties.$dialog({ tpl: 'GamePop' });
  };

  app.directive('space', (e, binding) => {
    const { lang } = store.state.app;
    const space = lang === 'zh-CN' ? '' : ' ';
    e.innerText = `${space}${binding.value}${space}`;

    // watch(() => binding, () => {
    //   console.log('bidding')
    // }, {immediate: true, deep: true})
  });

  app.directive('login', (e) => {
    const {
      app: { dicts },
      user,
    } = store.state;
    const event = e?._vei?.onClick;
    const loadingElement = document.createElement('i');
    loadingElement.classList.add('el-icon-loading');
    watch(
      () => dicts.platformgameidsv2Loading,
      (loading) => {
        try {
          if (event) {
            const nodes = [...e.childNodes];
            const isInsert = nodes.some((node) => node.className === 'el-icon-loading');
            if (loading) {
              if (!isInsert) {
                e.setAttribute('disabled', true);
                e.classList.add('is-loading');
                if (e.tagName === 'BUTTON') {
                  e.insertBefore(loadingElement, nodes[0]);
                } else {
                  e.appendChild(loadingElement);
                }
              }
            } else if (isInsert) {
              e.removeAttribute('disabled');
              e.classList.remove('is-loading');
              e.removeChild(loadingElement);
            }
          }
        } catch (e) { }
      },
      { immediate: true },
    );

    watch(
      () => user.isLogin,
      () => {
        if (store.state.user.isLogin) {
          e.removeEventListener('click', checkLogin);
          if (event) e.addEventListener('click', event);
        } else {
          if (event) e.removeEventListener('click', event);
          e.addEventListener('click', checkLogin);
        }
      },
      { immediate: true },
    );
  });

  app.directive('loadingBtn', (e, config) => {
    const { value } = config;
    e.style.visibility = 'hidden';

    const imgEle = document.createElement('img');
    imgEle.src = value;
    imgEle.onload = () => {
      e.style.visibility = 'visible';
    };
  });

  app.directive('gameStatus', (e, config) => {
    const {
      value,
      modifiers: { img },
    } = config;
    if (!value) return;

    if (e.tagName === 'BUTTON') {
      e.style.display = 'none';
    }

    const insert = (parent, dom) => {
      const w = parent.clientHeight * 0.6;
      if (dom) {
        dom.style.cssText = `width: ${w}px; height: ${w}px; font-size: ${w * 0.2}px;`;
        parent.appendChild(dom);
      }
    };

    const parent = e.parentNode;
    if (!parent.__not_play_game) {
      parent.__not_play_game = true;
      parent.style.position = 'relative';
      parent.classList.add('maintain-parent');
      const dom = document.createElement('maintain');
      dom.innerText = $t('维护中');
      dom.className = 'maintain';

      const targetImg = parent.querySelector('img');
      if (targetImg || img) {
        let timer = setInterval(() => {
          if (targetImg?.complete) {
            insert(parent);
            clearInterval(timer);
            timer = null;
          }
        }, 100);
      } else {
        insert(parent, dom);
      }
    }
  });

  // 多语言样式定制
  // v-lang:xx 其中xx为语种， v-lang:xx|xx，中划线分割传多语种
  app.directive('lang', (el, binding) => {
    const { arg, value } = binding;
    let { lang } = store.state.app;
    lang = lang || Cookies.get('lang');
    watch(
      lang,
      () => {
        if (lang === arg || arg.split('|').includes(lang)) {
          el.style = value;
        }
      },
      { immediate: true },
    );
  });

  // 旋转动画指令
  app.directive('refresh', (el, binding) => {
    el.classList[binding.value ? 'add' : 'remove']('refresh');
  });

  // 图片占位图
  app.directive('failed', (el) => {
    const url = store.state.app.darkTheme
      ? app.config.globalProperties.$getSrc('/src/assets/dark/placeholder.png')
      : app.config.globalProperties.$getSrc('/src/assets/images/placeholder.png');
    if (el.src) {
      el.onerror = () => {
        el.src = src;
      };
    } else {
      let img = new Image();
      if (el.style.backgroundImage) {
        el.style.backgroundImage = /url\("(.*)"\)/.exec(el.style.backgroundImage)[1];
      } else {
        el.style.backgroundImage = `url(${url})`;
        el.style.backgroundPosition = 'center';
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundSize = '50% auto';
        el.style.backgroundColor = 'var(--dark-bg-color-191919,var(--bg-color-f5f5f5))';
        el.style.transform = 'scale(1.1)';
      }
      // el.style.backgroundImage = el.style.backgroundImage ? /url\("(.*)"\)/.exec(el.style.backgroundImage)[1] : `url(${url})`;
      // img.src = /url\("(.*)"\)/.exec(el.style.backgroundImage)[1];
      // console.log(img.width, img.src);
      img.onerror = () => {
        el.style.backgroundImage = `url(${url})`;
        el.style.backgroundPosition = 'center';
        img = null;
      };
    }
  });

  /*
   * 参数说明：
   * s：要格式化的数字
   * n：保留几位小数
   * */
  function formatMoney(s, n = 0) {
    if (!s) return s;
    n = n > 0 && n <= 20 ? n : 2;
    s = `${parseFloat(`${s}`.replace(/[^\d\.-]/g, '')).toFixed(n)}`;
    const l = s.split('.')[0].split('').reverse();
    const r = s.split('.')[1];
    let t = '';
    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '');
    }
    return `${t.split('').reverse().join('')}`;
  }

  function moneyInit(currency, { el, val }) {
    let limit;
    if (typeof val === 'number') {
      limit = val;
    }
    // 准备
    const { money, unit } = priceUnitTransform(val || '0');

    const [integer, decimal] = money.toString().split('.');
    // 创建
    let tempNode = document.createElement('div');
    const iNode = document.createElement('i');
    const wrapNode = document.createElement('span');
    const childNode = document.createElement('span');
    const unitNode = document.createElement('span');
    const textNode = document.createTextNode(decimal ? `${integer}.` : integer);
    // 赋值
    // childNode.innerText = decimal;
    childNode.innerText = decimal.length !== 1 ? decimal.slice(0, 2) : `${decimal}0`;
    iNode.innerText = currency ?? '';
    iNode.className = 'wrap-money-currency';
    wrapNode.className = 'wrap-money-integer';
    childNode.className = 'wrap-money-decimal';
    wrapNode.title = val;
    el.classList.add('wrap-money');
    // 组装
    wrapNode.appendChild(textNode);
    wrapNode.appendChild(childNode);
    unitNode.innerText = unit;
    wrapNode.appendChild(unitNode);

    tempNode.appendChild(iNode);
    tempNode.appendChild(wrapNode);
    el.innerHTML = tempNode.innerHTML;
    tempNode = null;
  }

  // 货币符号
  app.directive('money', (el, binding) => {
    let currencySymbol = '';
    let val = '';
    watchEffect(() => {
      if (Array.isArray(binding.value)) {
        let values = [...binding.value];
        if (binding.value.length === 1) {
          values = [null, ...values];
        }
        [currencySymbol, val] = values;
      } else {
        const { user, agent } = store.state;
        currencySymbol = agent.currencySymbol || user.currencySymbol;
        val = binding.value;
      }
      moneyInit(currencySymbol, { el, val });
    });
  });

  // 指定元素区域外点击
  app.directive('clickOutside', {
    mounted(el, binding) {
      const { value, modifiers } = binding;
      function eventHandler(e) {
        if (el.contains(e.target)) {
          return false;
        }
        // 如果绑定的参数是函数，正常情况也应该是函数，执行
        value?.(e);
      }
      // 用于销毁前注销事件监听
      el.__click_outside__ = eventHandler;
      el.__click_outside_fn__ = Object.keys(modifiers)?.[0] ?? 'click';
      // 添加事件监听
      document.addEventListener(el.__click_outside_fn__, eventHandler);
    },
    beforeUnmount(el) {
      // 移除事件监听
      document.removeEventListener(el.__click_outside_fn__, el.__click_outside__);
      // 删除无用属性
      delete el.__click_outside__;
    },
  });
};
