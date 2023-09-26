<template>
  <div class="lang-wrap">
    <div class="lang">
      <el-dropdown trigger="hover" class="language" popper-class="language-dropdown" :placement="langPosition"
        @command="changeLang">
        <span class="el-dropdown-link">
          <p>
            <img :src="$getSrc(`/src/assets/images/header/${currentLang}.png`)" :alt="currentLang" />
            <!-- {{isShowlangText}} -->
            <span v-show="isShowlangText">{{ langMap[currentLang] }}</span>
            <!-- <span>{{langs?.filter(item => item.lang === currentLang)[0].zh}}</span> -->
            <i class="icon-white el-icon-caret-bottom"></i>
          </p>
        </span>
        <template #dropdown>
          <el-dropdown-menu class="language-drop">
            <el-dropdown-item v-for="item in langs" :key="item.lang" :command="item.lang"
              :class="`${item.lang === currentLang ? 'active' : ''}`">
              <div class="language-drop-content">
                <img :src="$getSrc(`/src/assets/images/header/${item.lang}.png`)" alt="cn" />
                <span class="languagesChoice">{{ item.zh }}</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { inject, watch, ref, onMounted, watchEffect, computed } from 'vue';
import Cookies from 'js-cookie';
import { getRegionLang } from '@/api/app';

const global = inject('global');
const $store = inject('store');
const subConfig = inject('subConfig');

const langs = ref([
  {
    lang: 'zh-CN',
    zh: '简体中文'
  }
]);

const currentLang = ref('');

onMounted(() => {
  initLangList();
  // getLocale();
  currentLang.value = Cookies.get('lang') ?? 'zh-CN';
});

const langText = computed(() => langs.value?.filter((item) => item.lang === currentLang.value)[0].zh);

defineProps({
  isShowlangText: {
    type: Boolean,
    default: false
  },
  langPosition: {
    type: String,
    defalut: 'bottom-end'
  }
});

const langMap = {
  'zh-CN': '简体中文',
  en: 'Eng',
  th: 'ไทย',
  vi: 'Tiếng Việt`'
};

// watchEffect(() => {
//   langs.value = [
//     {
//       lang: 'zh-CN',
//       zh: '简体中文'
//     },
//     {
//       lang: 'en',
//       zh: 'Eng'
//     },
//     {
//       lang: 'th',
//       zh: 'ไทย',
//     }, {
//       lang: 'vi',
//       zh: 'Tiếng Việt`',
//     },
//   ];
// });

function initLangList() {
  const configlangs = subConfig.langConfig;
  if (configlangs?.length) {
    // 子库有langConfig配置的商户
    langs.value = configlangs.map((l) => ({
      lang: l,
      zh: langMap[l] || ''
    }));
  }
}

function changeLang(lang) {
  if (lang === Cookies.get('lang')) return;
  currentLang.value = lang;
  global.$store.commit('app/SET_LANG', lang);
}

function getLocale() {
  if (Cookies.get('lang')) {
    return Cookies.get('lang');
  }
  getRegionLang().then((_lang) => {
    // 本地浏览器语言环境
    let locale = navigator.language || navigator.userLanguage; // 常规浏览器语言和IE浏览器
    locale = locale.substr(0, 2); // 截取lang前2位字符
    locale = locale === 'zh' ? 'zh-CN' : locale;
    console.log('local', locale, '_lang', _lang);
    let lang = 'en'; // 无法命中规则 默认使用 英文
    // 设备语言与ip语言一样显示能够匹配展示已有语言， 不一样显示英文
    if (locale === _lang && ['zh-CN', 'th', 'vi'].includes(_lang)) {
      lang = _lang;
    }
    changeLang(lang);
  });
}
</script>

<style lang="scss" scoped>
.lang-wrap {
  cursor: pointer;

  .lang {
    height: 14px;

    p {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0;

      img {
        width: 20px;
        height: 14px;
      }

      .icon-white {
        color: var(--font-color-fff);
        margin-left: 3px;
        font-size: 12px;
      }
    }
  }
}
</style>
