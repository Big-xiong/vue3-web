<template>
  <Cooperation v-if="showCooperation" />
  <div class="footer-wrap">
    <div class="footer-wrap-main">
      <div class="layout-flex-start top">
        <div v-for="(item, index) in navTop" :key="index" class="duty">
          <p class="title">{{ item.title }}</p>
          <div class="layout-flex-start">
            <div :style="{ width: item.width, height: item.height }" v-for="(item, index) in item.icon" :key="index">
            </div>
            <!-- <img
                          v-for="(item, index) in item.icon"
                          :key="index"
                          :src="$getSrc(`/src/assets/images/footer/${item}.png`)"
                          alt
            />-->
          </div>
        </div>
      </div>
      <div class="plat">
        <p class="title">{{ $t(`游戏平台`) }}</p>
        <div class="layout-flex-center plat-icon">
          <div v-for="(item, index) in platforms" :key="index">
            <div :style="{ width: item.width, height: item.height }"></div>
            <!-- <img
                          :src="$getSrc(`/src/assets/images/footer/plat${index + 1}.png`)"
                          alt
            />-->
          </div>
        </div>
      </div>
      <div class="layout-flex-start nav">
        <p>
          <span v-for="(item, index) in nav1" :key="index" @click="goPath(item)">{{ item.title }}</span>
        </p>
        <p>
          <span v-for="(item, index) in nav2" @click="goPath(item)" :key="index">{{ item.title }}</span>
        </p>
        <p>
          <span v-for="(item, index) in nav3" :key="index" @click="goPath(item)">{{ item.title }}</span>
        </p>
        <div class="social">
          <p class="title">{{ $t(`社交媒体`) }}</p>
          <div>
            <div class="layout-flex-start" v-for="(item, index) in contacts" :key="index" @click="go(item.link)">
              <template v-if="item.param_value">
                <img :src="item.icon" alt />
                <p>{{ item.param_value }}</p>
              </template>
            </div>

            <!-- <img
              v-for="(item,index) in contacts"
              :key="index"
              :src="$getSrc(`/src/assets/images/footer/social0${index + 1}.png`)"
              alt
            />-->
          </div>
        </div>
      </div>
      <p class="copyright">
        {{ $t(`{0}属于OGGLOBALACCESSLIMITED运营`, [subConfig.title]) }}
        <br />
        {{ $t(`{0}于2019年03月01日起由菲律宾政府PAGCOR授权及监管`, [subConfig.title]) }}
        <br />
        {{ $t(`{0}©版权所有违者必究`, [subConfig.title]) }}
      </p>
      <el-collapse v-model="activeNames">
        <el-collapse-item :title="$t('关于我们')" name="1">
          <div class="content" v-html="textData"></div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Cooperation from '@/components/Cooperation/index.vue';
import createDefaultRouter from '@/router/modules';
import { getSeoProtocol } from '@/utils/importFiles';

const defaultRouter = createDefaultRouter();
const subConfig = inject('subConfig');

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;
$store.dispatch('app/getDict', 'siteinfo');

const activeNames = ref('1');
const { data: textData } = useRequest(getSeoProtocol);

const contacts = ref([]);
watch(() => dicts.siteinfo, (res) => {
  contacts.value = res?.extend_params ? JSON.parse(res?.extend_params) : [];
}, { immediate: true });

const showCooperation = ref(false);

watch(global.$router.currentRoute.value, (val) => {
  showCooperation.value = false;
  defaultRouter[0].children.forEach((item) => {
    if (showCooperation.value) return;
    showCooperation.value = item.path === val.path;
  });
}, { immediate: true });

const navTop = [
  { title: global.$t(`博彩责任`), icon: [{ name: 'zr1', width: '30px', height: '30px' }, { name: 'zr1', width: '28px', height: '31px' }] },
  { title: global.$t(`运营监管`), icon: [{ name: 'jg1', width: '26px', height: '31px' }, { name: 'jg2', width: '33px', height: '32px' }] },
  { title: global.$t(`支付方式`), icon: [{ name: 'pay1', width: '101px', height: '23px' }, { name: 'pay2', width: '71px', height: '25px' }, { name: 'pay3', width: '75px', height: '30px' }, { name: 'pay1', width: '80px', height: '26px' }, { name: 'pay1', width: '42px', height: '25px' }, { name: 'pay1', width: '70px', height: '27px' }, { name: 'pay1', width: '97px', height: '23px' }, { name: 'pay1', width: '91px', height: '24px' }, { name: 'pay1', width: '98px', height: '20px' }] },
  { title: global.$t(`信息安全`), icon: [{ name: 'safe1', width: '86px', height: '17px' }] },
];

const platforms = [
  { name: 'pay1', width: '90px', height: '29px' },
  { name: 'pay2', width: '67px', height: '25px' },
  { name: 'pay3', width: '109px', height: '34px' },
  { name: 'pay4', width: '65px', height: '34px' },
  { name: 'pay5', width: '85px', height: '26px' },
  { name: 'pay6', width: '69px', height: '33px' },
  { name: 'pay7', width: '72px', height: '31px' },
  { name: 'pay8', width: '101px', height: '21px' },
  { name: 'pay9', width: '89px', height: '22px' },
  { name: 'pay10', width: '84px', height: '30px' },
  { name: 'pay11', width: '94px', height: '24px' },
  { name: 'pay12', width: '62px', height: '24px' },
  { name: 'pay13', width: '73px', height: '17px' },
  { name: 'pay14', width: '73px', height: '27px' },
  { name: 'pay15', width: '116px', height: '23px' },
];

const nav1 = [
  { title: global.$t(`体育博彩`), path: 'sport' },
  { title: global.$t(`电竞`), path: 'esport' },
  { title: global.$t(`真人娱乐场`), path: 'casino' },
  // { title: global.$t(`棋牌`), path: 'chess' },
  { title: global.$t(`老虎机`), path: 'slot' },
  { title: global.$t(`彩票`), path: 'lottery' },
  // { title: global.$t(`捕鱼游戏`), path: 'fishing' },
];
// 'https://speed.59001.wq-test.com/'
const speedUrl = ref('speed');

const nav2 = [
  { title: global.$t(`优惠`), path: 'promos' },
  { title: global.$t(`天王俱乐部`), path: 'vip' },
  { title: global.$t(`下载中心`), path: 'appDownload' },
  { title: global.$t(`备用域名`), path: speedUrl.value },
];

const nav3 = [
  { title: global.$t(`常见问题`), path: 'helpQuestion', id: '0-0' },
  { title: global.$t(`游戏手册`), path: 'helpManual', id: '1-0' },
  { title: global.$t(`安全保障`), path: 'helpSecurity', id: '2' },
];

function goPath({ path }) {
  if (import.meta.env.MODE === 'development') {
    speedUrl.value = `https://speed.59001.wq-test.com/`;
  } else {
    speedUrl.value = `https://speed.blizzwin.com/`;
  }

  path = path === 'speed' ? speedUrl.value : path;
  if (path.startsWith('http') || path.startsWith('https')) {
    window.location.href = path;
  } else {
    global.$router.push({ name: path });
  }
}

function go(link) {
  if (link) {
    window.open(link, 'contact');
  }
}

</script>

<style lang="scss" scoped>
.footer-wrap {
  line-height: 50px;
  background-color: var(--bg-color-footer, var(--bg-color-222930));
  color: var(--font-color-fff);
  text-align: left;

  :deep(.el-collapse-item__header) {
    color: var(--font-color-fff) !important;
  }

  :deep(.el-collapse-item__content) {
    color: var(--font-color-fff);
  }

  :deep(.el-collapse) {
    border-top: none;
    border-bottom: none;
  }

  :deep(.el-collapse-item__arrow) {
    color: var(--font-color-fff);
    font-size: 28px;
    transform: rotate(90deg);
  }

  :deep(.el-collapse-item__arrow.is-active) {
    transform: rotate(270deg);
  }

  &-main {
    width: 1200px;
    margin: 0 auto;
    padding-top: 40px;

    .title {
      font-size: 17px;
      color: var(--font-color-fff);
      font-weight: 700;
      line-height: 1;
      margin-bottom: 17px;
    }

    .top {
      align-items: flex-start;
      justify-content: space-between;
      padding-left: 20px;
    }

    .duty {
      &:nth-child(1) {
        >div div {
          @for $i from 1 through 2 {
            &:nth-child(#{$i}) {
              background: url('/src/assets/images/footer/zr#{$i}.png') center no-repeat;
              background-size: 100% auto;
              margin-right: 25px;

              &:hover {
                background: url('/src/assets/images/footer/zr#{$i}-active.png') center no-repeat;
                background-size: 100% auto;
              }
            }
          }
        }
      }

      &:nth-child(2) {
        >div div {
          @for $i from 1 through 2 {
            &:nth-child(#{$i}) {
              background: url('/src/assets/images/footer/jg#{$i}.png') center no-repeat;
              background-size: 100% auto;
              margin-right: 25px;

              &:hover {
                background: url('/src/assets/images/footer/jg#{$i}-active.png') center no-repeat;
                background-size: auto 100%;
              }
            }
          }
        }
      }

      &:nth-child(3) {
        max-width: 37%;

        >div {
          justify-content: space-between;

          div {
            @for $i from 1 through 9 {
              &:nth-child(#{$i}) {
                background: url('/src/assets/images/footer/pay#{$i}.png') left center no-repeat;
                background-size: 100% auto;
                margin-bottom: 42px;

                &:hover {
                  background: url('/src/assets/images/footer/pay#{$i}-active.png') left center no-repeat;
                  background-size: 100% auto;
                }
              }
            }
          }
        }
      }

      &:last-child {
        margin-right: 0;

        >div div {
          background: url('@/assets/images/footer/safe1.png') left center no-repeat;
          background-size: 100% auto;

          &:hover {
            background: url('@/assets/images/footer/safe1-active.png') left center no-repeat;
            background-size: 100% auto;
          }
        }
      }
    }

    .plat {
      padding-left: 20px;
    }

    .plat-icon {
      flex-wrap: wrap;
      justify-content: flex-start;

      >div {
        width: calc(100% / 8);
        margin-bottom: 20px;

        @for $i from 1 through 15 {
          &:nth-child(#{$i}) {
            div {
              background: url('/src/assets/images/footer/plat#{$i}.png') center no-repeat;
              background-size: 100% auto;
            }

            &:hover div {
              background: url('/src/assets/images/footer/plat#{$i}-active.png') center no-repeat;
              background-size: 100% auto;
            }
          }
        }
      }

      img {
        height: 25px;
        display: block;
      }
    }

    .nav {
      padding: 20px 40px 37px 59px;
      border-top: 1px solid var(--footer-border);
      border-bottom: 2px solid var(--footer-border);
      align-items: flex-start;
      justify-content: space-between;

      p {
        margin: 0;

        span {
          display: block;
          line-height: 28px;
          cursor: pointer;
        }
      }
    }

    .social {
      .title {
        margin-bottom: 17px;
      }

      img {
        width: 23px;
        display: block;
        margin-right: 10px;
        cursor: pointer;
      }

      .layout-flex-start {
        cursor: pointer;
        margin-bottom: 10px;

        p {
          line-height: 23px;
          position: relative;
          border-bottom: 1px solid #383e45;
          font-size: 10px;
          flex: 1;

          &:after {
            content: '';
            position: absolute;
            width: 0;
            height: 1px;
            background: var(--theme-color);
            bottom: 0;
            left: 50%;
            transition: 0.3s;
          }
        }

        &:hover p {
          color: var(--theme-color);

          &::after {
            width: 100%;
            left: 0;
          }
        }
      }
    }

    .copyright {
      padding: 25px 0 29px;
      text-align: center;
      font-size: 12px;
      line-height: 18px;
      margin: 0;
    }

    :deep(.el-collapse) {
      border: none;
    }

    :deep(.el-collapse-item__wrap) {
      border-bottom: none;
    }

    :deep(.el-collapse-item__header) {
      color: var(--font-color-fff);
      border: none;
    }

    :deep(.el-collapse-item__content) {
      color: var(--font-color-fff);
    }
  }
}
</style>
