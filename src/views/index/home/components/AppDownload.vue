<template>
  <div class="app-download-wrap">
    <div class="align-center-wrap layout-flex-between">
      <div class="left">
        <h3>{{ $t(`APP下载`) }}</h3>
        <p>{{ $t(`{0}倾情打造，业内最顶尖的手机投注APP。体育、电竞、真人、老虎机、彩票、数万种游戏玩法应有尽有。全站游戏适应所有移动设备，精彩游戏畅享指尖！`,[subConfig.title]) }}</p>
        <div>
          <div
            v-for="ele in downloadInfo"
            :key="ele.title"
            class="content"
          >
            <div class="content-top">
              <span class="top-icon-wrap">
                <img
                  :style="ele.iconStyle"
                  :src="$getSrc(ele.icon)"
                  alt
                />
              </span>
              <span>{{ ele.title }}</span>
            </div>
            <div class="content-bottom">
              <p>
                <img
                  :src="er_pic"
                  alt
                />
              </p>
              <ul>
                <li>
                  <p>{{ $t(`APP版本：`) }}</p>
                  <p>{{ ele.version }}</p>
                </li>
                <li>
                  <p>{{ $t(`更新日期：`) }}</p>
                  <p>{{ ele.update }}</p>
                </li>
                <li>
                  <p>{{ $t(`大小：`) }}</p>
                  <p>{{ ele.size }}</p>
                </li>
                <li>
                  <p
                    class="install-guide-wrap"
                    @click="$router.push({ name: 'appDownload' })"
                  >
                    <img
                      class="install-guide-icon"
                      :src="$getSrc(`/src/assets/images/home/install-guide-icon.png`)"
                      alt
                    />
                    <span>{{ $t(`安装指南`) }}</span>
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <el-carousel
          :interval="4000"
          type="card"
          height="614px"
          indicator-position="none"
        >
          <el-carousel-item
            v-for="(item,index) in 3"
            :key="item"
          >
            <img
              :src="$getSrc(`/src/assets/images/home/slide${index + 1}@3x_${$store.state.app.lang}.png`, `slide${index + 1}@3x_zh-CN`)"
              alt
            />
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  reactive, onMounted, inject, watch, ref,
} from 'vue';
import qrcode from 'qrcode';
import Cookies from 'js-cookie';

const global = inject('global');
const subConfig = inject('subConfig');

const downloadInfo = reactive([{
  title: global.$t(`IOS系统`),
  icon: '/src/assets/images/home/ios.png',
  version: '',
  update: '',
  size: '',
  iconStyle: {
    width: '56px',
    height: '56px',
  },
}, {
  title: global.$t(`安卓系统`),
  icon: '/src/assets/images/home/andr.png',
  version: '',
  update: '',
  size: '',
  iconStyle: {
    width: '44px',
    height: '52px',
  },
}]);

const $store = inject('store');
const { dicts } = $store.state.app;

const er_pic = ref('');
const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3,
  },
};
onMounted(() => {
  $store.dispatch('app/getDict', 'siteinfo');
  watch(() => dicts.siteinfo, (res) => {
    downloadInfo[0].version = res.ios_version;
    downloadInfo[1].version = res.android_version;

    downloadInfo[0].size = res.ios_size;
    downloadInfo[1].size = res.android_size;

    downloadInfo[0].update = res?.ios_update_date?.split('-').join('.') ?? '';
    downloadInfo[1].update = res?.android_update_date?.split('-').join('.') ?? '';
  });
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
.app-download-wrap {
  padding: 0px 0 30px;
  > div {
    align-items: flex-start;
  }
  .left {
    text-align: left;
    h3 {
      font-weight: var(--font-weight-700);
      color: var(--font-color-000);
      font-size: 20px;
      font-family: var(--font-family-bold);
      margin: 52px 0 24px;
    }
    > div {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    > p {
      padding-top: 24px;
      padding-bottom: 53px;
      width: 630px;
      font-size: 16px;
      text-align: left;
      color: var(--font-color-desc);
      line-height: 29px;
      margin: 0;
    }
    .content {
      &:first-child {
        margin-right: 40px;
      }
      .content-top {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .top-icon-wrap {
          width: 56px;
          height: 56px;
          display: inline-flex;
          justify-content: flex-start;
          align-items: center;
        }
        span {
          margin-left: 8px;
          font-size: 24px;
          font-family: var(--font-family-bold);
          font-weight: 600;
        }
      }
      .content-bottom {
        padding-top: 32px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        > p {
          width: 136px;
          box-sizing: border-box;
          border-radius: 5px;
          margin: 0 37px 0 0;
          border: 4px solid #efefef;
          img {
            width: 100%;
          }
        }
        ul {
          list-style: none;
          li {
            font-size: 16px;
            color: var(--font-color-desc);
            line-height: 24px;
            display: flex;

            p {
              margin: 0;
            }

            .install-guide-wrap {
              margin-top: 8px;
              border: 1px solid var(--border-color-000);
              border-radius: 6px;
              padding: 2px 8px 2px 12px;
              cursor: pointer;
              &:hover {
                border-color: var(--theme-color);
              }
              .install-guide-icon {
                margin-top: -5px;
                vertical-align: middle;
                width: 14px;
                margin-right: 5px;
                height: 15px;
              }
            }
          }
        }
      }
    }
  }
  .right {
    width: 40%;
    max-width: 672px;

    img {
      width: 100%;
    }
  }
  :deep(.el-carousel__mask) {
    background-color: var(--bg-color-fff);
  }
}
</style>
