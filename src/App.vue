<template>
  <router-view name="header" v-if="layout || path.includes('/affiliate')" />
  <template v-if="refresh">
    <div class="app-wrap"
      :class="{ 'agent-app-wrap': isAgent, 'agent-landing-wrap': router.currentRoute.value.name === 'agentLanding' }">
      <router-view v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
        </Suspense>
      </router-view>
    </div>
    <router-view name="footer" v-if="layout" />
    <m-teleport to="[lang-select]" v-if="subConfig.isI18n">
      <Lang />
    </m-teleport>
  </template>
  <SiteNoticeBox />
  <SiteAlert v-if="showNotify" />
</template>

<script setup>
import { useDocumentVisibility } from 'ahooks-vue';
import Cookies from 'js-cookie';
import { useRefresh } from '@/utils/hooks';
import Lang from '@/components/Layout/header/components/Lang.vue';
import SiteNoticeBox from '@/views/SiteNoticeBox.vue';
import SiteAlert from '@/components/SiteAlert/index.vue';
import MTeleport from '@/components/MTeleport.vue';
import { loadLanguageAsync } from '@/utils/changeLocale';

const {
  appContext, proxy,
} = getCurrentInstance();

const router = useRouter();
const { name, path } = useRoute();
const layout = ref(true);
const global = inject('global');
const { app, user, agent } = global.$store.state;
const nameList = ['403', '404', '500', 'firewall', 'play', 'kefu'];
const subConfig = inject('subConfig');

const { isVisible, visibilityState } = useDocumentVisibility();
watch(visibilityState, () => {
  if (isVisible.value && $store.state.user.isLogin) {
    $store.dispatch('user/getWalletInfo');
  }
});

// hack修复从落地页切回首页不显示语言选择的bug
const langKey = ref(0);
watch(() => global.$route.name, (routeName) => {
  nextTick(() => {
    langKey.value += 1;
  });
}, { immediate: true });

// 代理没有切换按钮
const isShowModeSwitch = computed(() => subConfig.isSwitchDark && document.querySelector('[mode-select]'));

const showNotify = computed(() => user?.isLogin && !nameList.includes(name) && !name.startsWith('agent'));

const { refresh, updateRefresh } = useRefresh(false);

const finishLoading = () => {
  const app = document.querySelector('#app');
  app.classList.add('slider-end');

  setTimeout(() => {
    app.classList.remove('app-loading');
  }, 300);

  // 时间为滑动动画的时间，需要与index.html的slider动效过滤时间一致
  setTimeout(() => {
    app.classList.remove('slider-end');
    app.classList.remove('slider');
  }, 1500);
};

const isAgent = ref(false);
onMounted(async () => {
  finishLoading();
  global.$store.dispatch('app/getDict', 'platformgameidsv2');
  watchEffect(() => {
    const { meta, path } = router.currentRoute.value;

    isAgent.value = path.includes('/affiliate');
    layout.value = meta.layout ?? true;
    // 此处严格判断等于false，因为未填写值为undefined
    if (meta.scroll === false) document.body.style.overflow = 'hidden';
  });
  if (subConfig.isSwitchDark) {
    const isDark = Cookies.get('darkTheme') === 'true';
    if (isDark) {
      global.$store.commit('app/SET_DARK_THEME');
    }
  } else {
    Cookies.set('darkTheme', false);
  }

  loadLanguageAsync(proxy.$i18n, app.lang)
    .then(() => updateRefresh());

  watch([() => app.headers['X-Inte-Region-Id'], () => app.lang], () => {
    updateRefresh();
  });
});
</script>

<style>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>