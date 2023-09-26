<template>
  <div class="appDownload-wrap">
    <Banner
      :src="`/src/assets/images/appDownload/download_bg@3x_${$store.state.app.lang}.jpg`"
      defaultSrc="download_bg@3x_zh-CN"
    />
    <div class="align-center-wrap">
      <div class="layout-flex-center appDownload-wrap-tab">
        <span
          :class="activeIndex === 0 ? 'active' : ''"
          @mouseenter="activeIndex = 0"
          :style="{ 'background-image': activeIndex === 0 ? `url(${$getSrc('/src/assets/images/appDownload/ios@3x.png')})` : `url(${$getSrc('/src/assets/images/appDownload/ios2@3x.png')})` }"
        >{{ $t(`苹果`) }}</span>
        <span
          :class="activeIndex === 1 ? 'active' : ''"
          @mouseenter="activeIndex = 1"
          :style="{ 'background-image': activeIndex === 1 ? `url(${$getSrc('/src/assets/images/appDownload/android2@3x.png')})` : `url(${$getSrc('/src/assets/images/appDownload/android@3x.png')})` }"
        >{{ $t(`安卓`) }}</span>
      </div>
      <div class="layout-flex-center appDownload-wrap-main">
        <div class="layout-flex-center info">
          <img
            src="/src/assets/images/appDownload/icon@3x.png"
            alt
          />
          <div>
            <h2>Blizzwin APP</h2>
            <p v-if="activeIndex === 0">
              {{ $t(`版本：`) }}{{ iosInfo.version }}
              <br />
              {{ $t(`更新日期：`) }}{{ iosInfo.update }}
              <br />
              {{ $t(`大小：`) }}{{ iosInfo.size }}
            </p>
            <p v-if="activeIndex === 1">
              {{ $t(`版本：`) }}{{ androidInfo.version }}
              <br />
              {{ $t(`更新日期：`) }}{{ androidInfo.update }}
              <br />
              {{ $t(`大小：`) }}{{ androidInfo.size }}
            </p>
          </div>
        </div>
        <div class="code">
          <img
            :src="er_pic"
            alt
          />
        </div>
        <p class="tip">{{ $t(`扫码下载{0}APP`, [subConfig.title]) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref, inject, onMounted, reactive, watch,
} from 'vue';
import qrcode from 'qrcode';
import Cookies from 'js-cookie';
import Banner from '@/components/Banner/index.vue';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;
const subConfig = inject('subConfig');
const activeIndex = ref(0);

const iosInfo = reactive({
  version: '',
  update: '',
  size: '',
});
const androidInfo = reactive({
  vaersion: '',
  update: '',
  size: '',
});

onMounted(() => {
  $store.dispatch('app/getDict', 'siteinfo');
  watch(() => dicts.siteinfo, (res) => {
    iosInfo.version = res?.ios_version;
    androidInfo.version = res?.android_version;

    iosInfo.size = res?.ios_size;
    androidInfo.size = res?.android_size;

    iosInfo.update = res?.ios_update_date;
    androidInfo.update = res?.android_update_date;
  }, { immediate: true });
});

const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3,
  },
};

const er_pic = ref('');
onMounted(() => {
  const ho = window.location.host;
  let link = `https://m.${ho}.com/appDownload`;
  if (Cookies.get('agentCode')) {
    link = `${link}?id=${Cookies.get('agentCode')}`;
  }
  qrcode.toDataURL(`https://m.${ho}/appDownload`, opts, (err, url) => {
    if (err) throw err;
    er_pic.value = url;
  });
});

</script>

<style lang="scss" scoped>
.appDownload-wrap {
  padding-bottom: 80px;

  &-tab {
    padding: 30px 0 36px;

    span {
      width: 86px;
      padding-top: 110px;
      background-size: 100% auto;
      background-repeat: no-repeat;
      margin: 0 90px;
      cursor: pointer;
      color: var(--font-color-bdbdbd);
      font-size: 24px;

      &:last-child {
        background-size: 100% auto;
      }

      &.active {
        background-size: 100% auto;
        color: var(--font-color-333);

        &:last-child {
          background-size: 100% auto;
        }
      }
    }
  }

  &-main {
    width: 1200px;
    margin: 0 auto;
    background-color: var(--bg-color-F2F3F4);
    text-align: center;
    flex-direction: column;
    padding-top: 50px;

    .info {
      text-align: left;
      color: var(--font-color-0a0a0a);

      img {
        width: 116px;
        margin-right: 30px;
      }

      h2 {
        font-size: 24px;
        font-family: SourceHanSansCN, SourceHanSansCN-Bold;
        font-weight: 700;
        line-height: 36px;
        margin: 0;
      }

      p {
        font-size: 17px;
        font-weight: 400;
        line-height: 24px;
        margin: 0;
      }
    }

    .code {
      width: 180px;
      opacity: 1;
      background: #d8d8d8;
      border: 1px solid #979797;
      margin-top: 65px;
      text-align: center;
      line-height: 180px;
      box-sizing: border-box;
      padding: 10px;
      box-sizing: border-box;
      img {
        display: block;
        width: 100%;
      }
    }

    .tip {
      font-size: 17px;
      font-family: SourceHanSansCN, SourceHanSansCN-Regular;
      font-weight: 400;
      text-align: left;
      color: var(--font-color-000);
      line-height: 1;
      margin: 030px 0 58px;
    }
  }
}
</style>
