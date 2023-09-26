<template>
  <div class="suspension-wrap">
    <!-- 每日任务 -->
    <div
      class="everyday-entrance"
      v-if="user?.isLogin && everylist.length"
      @click="showEveryday"
    >
      <img
        class="entrance-bg"
        :src="$getSrc('/src/assets/images/everyday/everyday-bg@3x.png')"
      />
      <img
        class="entrance-btn"
        :src="$getSrc('/src/assets/images/everyday/everyday-btn@3x.png')"
      />
    </div>
    <!-- 返回顶部 -->
    <div
      v-if="btnFlag === true"
      class="layout-flex-center suspension-wrap-item"
      @click="backTop"
    >
      <svg-icon name="top" />
      <span>{{ $t("回顶部") }}</span>
    </div>
    <!-- 联系客服 -->
    <div
      v-if="kefuType === 1"
      class="layout-flex-center suspension-wrap-item"
    >
      <svg-icon name="customer" />
      <span>{{ $t("在线客服") }}</span>
      <div class="wrapper">
        <div class="layout-flex-center content">
          <div class="title">{{ $t("联系在线客服") }}</div>
          <div class="tips">{{ $t("在线客服为您解答问题7x24小时") }}</div>
          <div>
            <el-button @click="$openKefu">{{ $t("在线客服") }}</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 请求回电 -->
    <div class="layout-flex-center suspension-wrap-item">
      <svg-icon name="call" />
      <span>{{ $t("请求回电") }}</span>
      <div class="wrapper">
        <div class="layout-flex-center content">
          <div class="title">{{ $t("请求回电") }}</div>
          <div
            class="tips"
            style="width: 196px;"
          >{{ $t("输入手机号需要客服稍后拨打电话联系您？") }}</div>
          <div>
            <el-button
              v-login
              @click="makeCall"
            >
              {{
                  $t("请求回电")
              }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- app下载 -->
    <div class="layout-flex-center suspension-wrap-item">
      <svg-icon name="download" />
      <span>{{ $t("APP下载") }}</span>
      <div class="wrapper">
        <div
          class="layout-flex-center content"
          style="height: 260px;"
        >
          <div class="qrcode">
            <img
              :src="codeUrl"
              alt
            />
          </div>
          <div class="info">{{ $t("扫码下载APP") }}</div>
        </div>
      </div>
    </div>

    <CallBack
      :callBackShow="callBackShow"
      @close="close"
    />
    <!-- <Everyday
      v-if="user?.isLogin"
      v-model:show="everyDia"
    /> -->
  </div>
</template>

<script setup>
import {
  inject,
  reactive,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from 'vue';
import qrcode from 'qrcode';
import { useRequest } from 'ahooks-vue';
import CallBack from '@/components/CallBack/index.vue';
import { dailytasks } from '@/api/home';
// import Everyday from './Everyday.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const btnFlag = ref(false);
const kefuType = ref(1);
const callBackShow = ref(false);
const everyDia = ref(false);

const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3,
  },
};
const codeUrl = computed(() => {
  const { origin, hostname, protocol } = window.location;
  const urlLink = origin.indexOf('//www') !== -1
    ? `${origin.replace('//www', '//m')}/appDownload`
    : `${protocol}//m.${hostname}/appDownload`;
  let qrurl = '';
  qrcode.toDataURL(urlLink, opts, (err, url) => {
    if (err) throw err;
    qrurl = url;
  });
  return qrurl;
});

const { data: everylist } = useRequest(dailytasks, {
  manual: !user.isLogin,
});

function scrollToTop() {
  const scrollTop = window.pageYOffset
    || document.documentElement.scrollTop
    || document.body.scrollTop;
  btnFlag.value = scrollTop > window.screen.height;
}
onMounted(() => {
  window.addEventListener('scroll', scrollToTop);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scrollToTop);
});

function makeCall() {
  callBackShow.value = true;
}
function close(data) {
  callBackShow.value = false;
}

function backTop() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

function showEveryday() {
  global.$dialog({ tpl: 'EverydaySign' });
}
</script>

<style lang="scss" scoped>
.suspension-wrap {
  position: fixed;
  right: 0;
  bottom: 60px;
  width: 100px;
  z-index: 9999999;

  &-item {
    position: relative;
    width: 100px;
    height: 90px;
    font-size: 14px;
    color: var(--font-color-fff);
    cursor: pointer;
    background: var(--side-bg-color);
    flex-direction: column;

    &::after {
      position: absolute;
      bottom: 0;
      left: 0;
      content: '';
      width: 100%;
      height: 1px;
      background-color: var(--border-color-000-2);
    }

    .svg-icon {
      width: 26px;
      height: 26px;
      fill: var(--font-color-fff) !important;
      margin-bottom: 10px;
    }

    &:hover {
      .svg-icon {
        color: var(--theme-color);
      }

      .wrapper {
        display: block;
      }
    }

    .wrapper {
      position: absolute;
      right: 100px;
      padding: 0 10px;
      display: none;
      bottom: 0;
      text-align: center;

      .content {
        width: 200px;
        height: 201px;
        background-color: var(--theme-color);
        border-radius: 4px;
        flex-direction: column;

        .title {
          font-size: 18px;
          color: var(--font-color-fff);
          text-align: center;
        }

        .tips {
          font-size: 14px;
          color: var(--font-color-ccc);
          text-align: center;
          width: 140px;
          margin: 15px 0 21px;
          padding: 0 10px;
          line-height: 20px;
          box-sizing: border-box;
        }

        .el-button {
          color: var(--font-color-fff-4) !important;
          border-color: var(--font-color-fff-4) !important;
        }

        .qrcode {
          background: var(--bg-color-353435);
          border-radius: 2px;
          width: 180px;

          img {
            width: 100%;
          }
        }

        .info {
          font-size: 14px;
          color: var(--font-color-ccc);
          margin-top: 20px;
        }
      }
    }
  }
}

@keyframes scale {
  0% {
    transform: scale(0.6);
  }

  100% {
    transform: scale(1);
  }
}

.everyday-entrance {
  position: relative;
  width: 94px;
  height: 94px;
  cursor: pointer;

  .entrance-bg {
    width: 100%;
  }

  .entrance-btn {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    animation: scale 0.3s linear 0s infinite alternate;
  }

  img {
    width: 100%;
    display: block;
  }
}
</style>
