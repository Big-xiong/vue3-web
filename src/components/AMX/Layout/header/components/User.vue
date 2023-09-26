<template>
  <div
    v-loading="user.loginLoading"
    element-icon-small
    class="layout-flex-center app-header-users"
  >

    <template v-if="user?.isLogin">
      <!-- {{user.userInfo.username}} -->
      <el-popover
        placement="bottom"
        trigger="hover"
        :show-arrow="false"
        popper-class="header-info-tooltip"
      >
        <template #reference>
          <div
            class="app-header-users-info pointer"
            @click="$router.push({ name: 'centerHome' })"
          >
            <p class="layout-flex-center">
              <svg-icon name="icon-money"></svg-icon>
              <span v-money="priceFormat(Number(user.walletInfo.money || '0') + Number(user.walletInfo.all_platform_money || '0') + Number(user.walletInfo.financing_money || '0'))"></span>
              <svg-icon
                name="fresh"
                :class="['refresh', { loading: user.walletLoading || user.uploadWalletLoading }]"
                @click.stop="doRefresh"
              />
            </p>
            <p class="username">
              <svg-icon name="icon-user"></svg-icon>
              <span>{{ user?.userInfo?.username }}</span>
              <i class="el-icon-arrow-down"></i>
            </p>
          </div>
        </template>
        <router-link :to="{ name: 'centerHome' }">{{ $t('个人中心') }}</router-link>
        <router-link :to="{
              name: 'centerRebate', params: {
                title: '自助洗码',
                renderTitle: false,
                noBg: true,
              }
            }">{{ $t('自助洗码') }}</router-link>
        <a
          class="logout"
          @click="handleLogout"
        >{{ $t('安全退出') }}</a>
      </el-popover>
      <div class="app-header-users-actions">
        <el-button
          type="primary"
          class="animate-button"
          @click="$router.push({
              name: 'centerDeposit',
              params: {
                title: '存款',
              }
            })"
        >{{ $t('存款') }}</el-button>
        <el-button @click="$router.push({
              name: 'centerWithdraw',
              params: {
                title: '取款',
                renderTitle: false,
                noBg: true
              }
            })">{{ $t('取款') }}</el-button>
      </div>
    </template>
    <template v-else>
      <div class="app-header-users-actions">
        <el-button
          type="primary"
          class="animate-button"
          @click="$router.push({ name: 'register' })"
        >
          {{ $t('注册') }}
          <div class="move" />
        </el-button>
        <el-button
          type="default"
          @click="handleLogin"
        >{{ $t('登录') }}</el-button>
      </div>
    </template>

  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';
import { priceFormat } from '@/utils/index';

const data = reactive({
  walletLoading: false,
});

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;

function handleLogin() {
  $store.commit('user/SET_LOGIN_DIALOG', true);
}

function handleLogout() {
  $store.dispatch('user/logout').then(() => {
    global.$router.push('/');
  });
}

function doRefresh() {
  $store.dispatch('user/getWalletInfo');
}
</script>

<style lang="scss">
.header-info-tooltip {
  background: var(--block-bg-color) !important;
  border-radius: 6px;
  width: 160px;
  padding: 0 !important;
  border: 0 !important;

  a {
    display: block;
    cursor: pointer;
    text-decoration: none;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: var(--font-color-fff);
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);

    &:hover {
      background: var(--area-color);
      color: var(--theme-color);
    }

    &:first-child {
      border-radius: 6px 6px 0 0;
    }

    &:last-child {
      border: 0;
      border-radius: 0 0 6px 6px;
    }
  }
}
</style>

<style lang="scss" scoped>
.app-header-users {
  min-width: 380px;
  height: 41px;
  justify-content: flex-end;

  .refresh {
    fill: var(--font-color-fff);
    width: 12px;
    height: 12px;
    margin-left: 4px;
  }

  &-info {
    margin-right: 20px;
    font-size: 14px;
    color: var(--font-color-e7e7e7);

    span {
      padding: 0 5px;
    }

    p {
      justify-content: flex-start;
      margin: 0;
      height: 25px;

      > img {
        width: 12px;
      }

      &.username {
        text-align: left;
        color: var(--font-color-fff);
        margin-top: 10px;
      }

      i.loading {
        animation: rotate 2s linear infinite;
      }

      &:first-child {
        color: var(--theme-color);

        span {
          font-size: 18px;
        }

        i {
          color: var(--font-color-fff);
        }
      }
    }
  }

  &-actions {
    text-align: right;
    white-space: nowrap;
    display: flex;

    .animate-button {
      border-radius: 4px;
      background-repeat: no-repeat;
      text-align: center;
      cursor: pointer;
      color: var(--font-color-fff);
      display: inline-block;
      position: relative;

      .moveGif {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        opacity: 0.4;
      }
    }

    .el-button {
      margin-left: 20px;
      min-width: 90px;
      line-height: 37px !important;
      height: auto !important;
      min-height: 37px !important;
      padding: 0;

      &:first-child {
        color: var(--font-color-fff);
        position: relative;
        overflow: hidden;
        @-webkit-keyframes changeImg {
          from {
            left: -100%;
          }

          100% {
            left: 150%;
          }
        }

        .move {
          position: absolute;
          animation: changeImg 3s ease 0s;
          top: 0;
          left: 0;
          opacity: 0.6;
          width: 30%;
          height: 100%;
          content: '';
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: skewX(-45deg);
          animation-iteration-count: infinite;
        }
      }
    }
  }
}
@keyframes rotate {
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(-360deg);
  }
}
</style>
