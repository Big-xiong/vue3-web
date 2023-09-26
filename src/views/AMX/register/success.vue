<template>
  <div
    class="register-success-wrap"
    :style="{ 'background-image': `url(${$getSrc('/src/current_project/assets/images/register/success-bg.jpg')})` }"
  >
    <div class="register-success-wrap-content align-center-wrap">
      <img
        class="success"
        :src="$getSrc('/src/assets/images/register/bet_icon_reg_fast_success@2x.png')"
        alt
      />
      <h1>{{ $t(`恭喜您已成为{0}尊贵会员`, [subConfig.title]) }}</h1>
      <div class="register-success-wrap-content-table">
        <p class="layout-flex-center">
          <span>
            {{ $t(`账号：`) }}
            <b>{{ user?.userInfo?.username }}</b>
          </span>
          <i @click="global.$dialog({ tpl: 'ChangePwdOrAccount', username: user?.userInfo?.username, pwd: pwd })">{{ $t(`修改账号`) }}</i>
        </p>
        <p class="layout-flex-center">
          <span>
            {{ $t(`密码：`) }}
            <b>{{ pwd ?? '' }}</b>
          </span>
          <i @click="global.$dialog({ tpl: 'ChangePwdOrAccount', username: user?.userInfo?.username, pwd: pwd })">{{ $t(`修改密码`) }}</i>
        </p>
      </div>
      <div class="register-success-wrap-btns">
        <el-button
          type="primary"
          @click="$router.push({ name: 'centerDeposit' })"
        >{{ $t(`立即存款`) }}</el-button>
        <el-button
          @click="saveText"
          type="default"
        >{{ $t(`保存账号密码`) }}</el-button>
      </div>
    </div>
    <div class="register-success-wrap-bottom align-center-wrap">
      <div
        :style="{ 'background-image': `url(${$getSrc(`/src/assets/images/register/Device-zh-CN@2x.png`, `/src/assets/images/register/Device-zh-CN@2x.png`)})` }"
        class="phonePic"
      />
      <div class="first">
        <p class="title">{{ $t('完美兼容安全设备4种') }}</p>
        <p class="count">
          <span>4</span>
          {{ $t('种') }}
        </p>
        <p class="download-info">{{ $t(`{0}平台作为行业第一，拥有卓越的技术团队，自主研发了引领市场的全套终端，供您随时随地畅享游戏。Web、H5、IOS、Android原生App全方位满足您的娱乐需求。掌上娱乐，尽在{1}。贴心服务，7x24在线客服时刻伴您左右。`, [subConfig.title]) }}</p>
        <div class="layout-flex-between download-code">
          <div>
            <div>
              <img
                :src="er_pic"
                class="download-android"
              />
            </div>
            <p class="layout-flex-center">
              <svg-icon name="ios" />
              <span>{{ $t('iPhone下载') }}</span>
            </p>
          </div>
          <div>
            <div>
              <img
                :src="er_pic"
                class="download-ios"
              />
            </div>
            <p class="layout-flex-center">
              <svg-icon name="andorid" />
              <span>{{ $t('Android下载') }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="second">
        <div class="tag"></div>
        <p class="title">{{ $t('注册后即刻存款的玩家高达') }}</p>
        <p class="count">
          <span>84</span>%
        </p>
        <ul class="recommend-list">
          <h5 class="recommend-headline">{{ $t('您的首次存款，将激活以下优惠') }}:</h5>
          <li
            v-for="item in data"
            :key="item.name"
          >
            <p class="main-title">
              {{ item.title || item.name }}，
              <span class="sub-title">{{ item.h5_sub_title }}</span>
            </p>
          </li>
        </ul>
        <img
          src="@/assets/images/register/gift@2x.png"
          alt
        />
        <el-button
          type="primary"
          @click="$router.push({ name: 'centerDeposit' })"
        >{{ $t('立即存款') }}</el-button>
      </div>
      <div class="thrid">
        <p class="title">{{ $t('精选多个顶尖游戏品牌合作') }}</p>
        <p class="count">
          <span>23</span>
          {{ $t('家') }}
        </p>
        <p class="tips">{{ $t('每天大小赛事超过500场，涵盖全球范围全部主流竞技运动。更有真人娱乐、彩票游戏、电子竞技、捕鱼电玩、棋牌游戏，提供全方位的游戏选择，让您畅游更畅快!') }}</p>
        <img
          :src="$getSrc('/src/assets/images/register/cooperation.png')"
          alt
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, onMounted, watch } from 'vue';
import Cookies from 'js-cookie';
import { useRequest } from 'ahooks-vue';
import qrcode from 'qrcode';
import { allbenefit } from '@/api/active';
import { firstchange } from '@/api/user';
// import ChangePwdOrAccount from './components/ChangePwdOrAccount.vue';

const global = inject('global');
const subConfig = inject('subConfig');
const $store = inject('store');

const { user, app: { dicts } } = $store.state;
const pwd = ref(Cookies.get('pwd'));
const info = ref({});

watch(
  () => $store.state.user.password,
  (val) => {
    pwd.value = val;
  },
);

const modelValue = ref(false);

const opts = {
  errorCorrectionLevel: 'H',
  type: 'image/jpeg',
  rendererOpts: {
    quality: 0.3,
  },
};
const er_pic = ref('');
const area = ref('');
const moneyType = ref('');
onMounted(() => {
  $store.dispatch('app/getDict', 'siteinfo');
  const ho = window.location.host;
  let link = `https://m.${window.location.host}/appDownload`;
  if (Cookies.get('agentCode')) {
    link = `${link}?id=${Cookies.get('agentCode')}`;
  }
  qrcode.toDataURL(`https://m.${ho}/appDownload`, opts, (err, url) => {
    if (err) throw err;
    er_pic.value = url;
  });
});

function open(i) {
  info.value = {
    username: user?.userInfo?.username,
    password: pwd.value,
  };

  show.value = true;
}

const { data } = useRequest(() => allbenefit({ is_display: 3 }), {
  formatResult: (res) => res?.data?.splice(0, 4) ?? [],
});

function saveText() {
  const content = `username：${user?.userInfo?.username}\npassword：${pwd}`;
  const filename = `${dicts?.siteinfo?.title}账号密码.txt`;
  const eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  const blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
}
</script>

<style lang="scss">
.page-register-success-wrap {
  min-height: 1150px;
  background-color: red;
}
.register-success-wrap {
  padding: 50px 0;
  background-color: var(--bg-color-f9f9f9);
  background-size: cover;

  .align-center-wrap {
    width: 1200px;
    padding: 0;
    margin-top: 80px;
  }

  &-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .icon-selected {
      font-size: 55px;
    }

    h1 {
      color: var(--cur-font-color-333);
      font-weight: 400;
    }

    .success {
      width: 60px;
    }

    &-table {
      border: 1px solid var(--border-color-000-2);
      border-radius: 4px;

      p {
        margin: 0;

        &:first-child {
          border-bottom: 1px solid var(--border-color-000-2);
        }

        span {
          padding: 15px 20px;
          flex: 1;
          text-align: left;
          color: var(--font-color-999);

          b {
            color: var(--font-color-ccc);
          }

          &:first-child {
            border-right: 1px solid var(--border-color-000-2);
          }
        }

        i {
          font-style: normal;
          color: var(--cur-color-122339);
          text-decoration: underline;
          cursor: pointer;
          padding: 0 20px;
        }
      }
    }
  }

  &-btns {
    display: flex;
    margin-top: 18px;

    .el-button {
      min-width: 190px;

      &--primary {
        background-color: var(--cur-color-00213a);

        &:hover {
          background-color: var(--cur-color-00213a);
          opacity: 0.8;
        }
      }

      &--default {
        background-color: transparent;
        color: var(--font-color-fff-4);
        border-color: var(--font-color-fff-4);

        &:hover {
          background-color: transparent;
          color: var(--font-color-fff);
          opacity: 0.8;
        }
      }
    }
  }

  &-bottom {
    padding-top: 80px;
    display: flex;

    > div {
      color: var(--font-color-f5f5f5);
      background-repeat: no-repeat;
      background-size: 100% auto;
      position: relative;
      margin-right: 14px;
    }

    .phonePic {
      height: 490px;
      width: 245px;
      top: 34px;
    }

    .title {
      font-size: 16px;
      margin: 0;
      padding: 34px 0 12px;
      color: var(--theme-color);
    }

    .count {
      font-size: 22px;
      font-weight: bold;
      color: var(--theme-color);
      margin: 0;

      span {
        font-size: 50px;
      }
    }

    .first {
      width: 330px;
      height: 557px;
      background-color: var(--current-bg-color-fff);
      border-radius: 12px;

      .tips {
        margin: 15px 0 33px;
        font-size: 20px;
      }

      .download-info {
        text-align: left;
        font-size: 13px;
        color: var(--cur-font-color-333);
        line-height: 26px;
        font-weight: 600;
        overflow-y: auto;
        padding: 0 20px;
      }

      .download-code {
        margin: 0 20px;
        > div {
          > div {
            width: 126px;
            opacity: 1;
            background: #eaeaea;
            border: 2px solid var(--theme-color);
            border-radius: 8px;
            box-sizing: border-box;
            overflow: hidden;
            img {
              display: block;
              width: 100%;
            }
          }
          p {
            margin: 10px 0;
            color: var(--cur-font-color-333);
            font-size: 14px;
            line-height: 26px;

            .svg-icon {
              width: 12px;
              height: 12px;
              fill: var(--font-color-000);
              margin-right: 6px;
            }
          }
        }
      }
    }

    .second {
      width: 330px;
      height: 557px;
      background-color: var(--current-bg-color-fff);
      border-radius: 12px;

      .tag {
        position: absolute;
        width: 128px;
        height: 128px;
        background: url('@img/register/tag.png') no-repeat;
        background-size: 100% auto;
        top: -9px;
        left: -8px;

        span {
          font-size: 22px;
          color: var(--cur-font-color-333);
          transform: rotate(-45deg);
          position: absolute;
          width: 115px;
          height: 115px;
          left: 0;
          top: 0;
          line-height: 83px;
        }
      }

      .title {
        padding-left: 70px;
        text-align: left;
      }

      > img {
        display: block;
        width: 247px;
        margin: 0 auto;
      }

      .recommend-list {
        font-size: 14px;
        list-style: none;
        padding: 0;
        margin: 0;
        left: 59px;
        top: 135px;
        right: 35px;
        text-align: left;
        padding: 0 35px 0 59px;
        height: 180px;
        overflow: auto;
        box-sizing: border-box;

        li {
          // display: flex;
          font-size: 13px;
          position: relative;
          color: var(--cur-font-color-333);
        }

        .main-title {
          font-weight: 600;
          margin-top: 10px;
        }

        .recommend-headline {
          font-size: 14px;
          padding-bottom: 20px;
          font-weight: 600;
          margin: 0;
          color: var(--cur-font-color-333);
        }

        .sub-title {
          color: var(--theme-color);
        }

        p {
          display: inline-block;
        }

        li::before {
          content: '\2022'; /* Add content: \2022 is the CSS Code/unicode for a bullet */
          color: var(--theme-color); /* Change the color */
          font-weight: bold; /* If you want it to be bold */
          // width: 20px;
          display: inline-block; /* Needed to add space between the bullet and the text */
          width: 1em; /* Also needed for space (tweak if needed) */
          margin-left: -1em; /* Also needed for space (tweak if needed) */
          font-size: 30px;
          position: absolute;
          top: 0;
          left: 0;
        }
      }

      .chashao {
        width: 310px;
      }

      .el-button {
        width: 240px;
        height: 41px;
        font-size: 15px;
        border: 0;
        border-radius: 4px !important;
      }
    }

    .thrid {
      width: 244px;
      height: 489px;
      background: var(--current-bg-color-fff);
      border-radius: 12px;
      position: relative;
      top: 34px;

      .tips {
        font-size: 13px;
        line-height: 26px;
        color: var(--cur-font-color-333);
        height: 140px;
        overflow: auto;
        padding: 0 17px;
        text-align: left;
        font-weight: bold;
      }

      img {
        display: block;
        width: 219px;
        margin: 0 auto;
      }
    }
  }
}
</style>
