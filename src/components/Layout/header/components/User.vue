<template>
  <div class="top-wrap-right">
    <div class="layout-flex-center item">
      <el-dropdown>
        <div class="layout-flex-center">
          <img src="/src/assets/images/header/zhanghu@2x.png" alt class="user" />
          <span class="username">{{ user?.userInfo?.username }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu style="text-align: center;" class="username-dropdown">
            <el-dropdown-item @click="$router.push({ name: 'centerHome' })">{{ $t(`会员中心`) }}</el-dropdown-item>
            <el-dropdown-item @click="$router.push({ name: 'centerRebate' })">{{ $t(`洗码`) }}</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">{{ $t(`安全退出`) }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="layout-flex-center item">
      <span>{{ $t(`总余额：`) }}</span>
      <span
        class="meney"
        v-money="Number(user.walletInfo.money || '0') + Number(user.walletInfo.all_platform_money || '0') + Number(user.walletInfo.financing_money || '0')"
        @click="$router.push({
          name: 'centerTransfer',
          params: {
            title: '额度转账',
            noBg: true
          }
        })"
      />
      <img
        src="/src/assets/images/header/shuaxin@2x.png"
        alt
        :class="['refresh', { loading: user.walletLoading || user.uploadWalletLoading }]"
        @click="doRefresh"
      />
      <el-button
        type="primary"
        @click="$router.push({
          name: 'centerDeposit',
          params: {
            title: '存款',
          }
        })"
      >{{ $t(`存款`) }}</el-button>
      <el-button
        type="line"
        @click="$router.push({
          name: 'centerWithdraw',
          params: {
            title: '取款',
            renderTitle: false,
            noBg: true
          }
        })"
      >{{ $t(`提款`) }}</el-button>
      <el-button
        type="line"
        @click="$router.push({
          name: 'centerTransfer',
          params: {
            title: '额度转账',
            noBg: true
          }
        })"
      >{{ $t(`转账`) }}</el-button>
    </div>
    <div class="layout-flex-center item">
      <div class="mail-show">
        <img
          src="/src/assets/images/header/email@2x.png"
          alt
          class="email"
          @click="$router.push({ name: 'centerSiteMail' })"
        />
        <!-- <svg-icon name="mail" v-login @click="$router.push({ name: 'centerSiteMail' })" /> -->
        <div
          v-if="user?.userInfo && user?.userInfo.user_notice_unread_counts > 0"
          class="nums"
        >{{ user?.userInfo ? user?.userInfo.user_notice_unread_counts : '' }}</div>
        <div v-if="user?.userInfo && user?.userInfo.user_notice_unread_counts > 0" class="mail">
          <div class="title">
            {{ $t('通知事项') }}
            <span>{{ $t('您有') }}{{ user?.userInfo ? user?.userInfo.user_notice_unread_counts : 0 }}{{ $t('条新通知') }}</span>
          </div>
          <div class="list" v-if="messageList && messageList.length">
            <div
              v-for="(item, $index) in messageList"
              v-show="$index < 4"
              :key="item.id"
              class="item pointer"
              @click="$router.push({ name: 'centerSiteMail' })"
            >
              <div v-show="item.is_read === 0" class="dot" />
              <div
                class="title"
                v-if="messageTypeList && messageTypeList.length"
              >{{ messageTypeList[item.type] }}</div>
              <div class="content">{{ item.content }}</div>
              <div class="time">{{ item.updated_at }}</div>
            </div>
          </div>
          <div
            class="bottom pointer"
            @click="$router.push({ name: 'centerSiteMail' })"
          >{{ $t('更多消息动态') }}</div>
        </div>
      </div>
    </div>
    <div class="layout-flex-center item">
      <el-button type="line" @click="handleLogout" style="margin-right: 14px">{{ $t(`退出`) }}</el-button>
      <div class="mode-switch" />
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { useRequest } from 'ahooks-vue';
import Cookies from 'js-cookie';
import { message, messagetypelist } from '@/api/center';

const global = inject('global');
const $store = inject('store');
const { user, app } = $store.state;

const { run: typeRun, data: messageTypeList } = useRequest(messagetypelist, {
  manual: true,
});
const { run: messageRun, data: messageList } = useRequest(message, {
  manual: true,
  formatResult: (res) => res.data,
});
if (Cookies.get('access_token')) {
  typeRun();
  messageRun();
}

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

<style>
.username-dropdown {
  min-width: 96px;
}
</style>

<style lang="scss" scoped>
.top-wrap-right {
  .item {
    position: relative;
    padding: 0 17px;
    font-size: 14px;

    :deep(.wrap-money-currency),
    .meney {
      color: var(--theme-color) !important;
      cursor: pointer;
    }

    &:last-child {
      padding-right: 0;
    }

    &:not(:last-child)::after {
      content: "";
      position: absolute;
      width: 1px;
      height: 22px;
      opacity: 1;
      background: var(--input-border-color);
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    .el-button {
      min-width: 74px;
      min-height: 30px;
      line-height: 30px;
      padding: 0;
    }

    .user {
      width: 15px;
      margin-right: 7px;
    }

    .refresh {
      width: 19px;
      margin: 0 17px 0 7px;
      cursor: pointer;
    }

    .email {
      width: 30px;
      cursor: pointer;
    }
    i {
      font-style: normal;
      color: var(--theme-color);
    }

    .username {
      color: var(--theme-color);
      font-weight: bold;
      cursor: pointer;
    }
  }

  .el-button {
    font-size: 13px;
  }

  .mail-show {
    position: relative;

    &:hover {
      .mail {
        display: block;
      }
    }

    .nums {
      position: absolute;
      top: -8px;
      right: -7px;
      width: 14px;
      height: 14px;
      background: #902b2c;
      border: 1px solid #ccc;
      border-radius: 10px;
      line-height: 14px;
      font-size: 12px;
      text-align: center;
    }

    .mail {
      position: absolute;
      right: 0;
      width: 360px;
      z-index: 800;
      display: none;
      background-color: var(--bg-color-fff);
      box-shadow: 0px 2px 50px 0px rgba(0, 0, 0, 0.3);
      border-radius: 0 0 11px 11px;

      > .title {
        background-color: var(--theme-color);
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: var(--font-color-fff);
        text-align: left;
        padding-left: 20px;

        span {
          float: right;
          margin-right: 20px;
          font-size: 12px;
          color: var(--font-color-f5f5f5);
        }
      }

      .list {
        background: #181818;
        line-height: normal;
        text-align: left;
        max-height: 280px;
        overflow: auto;

        .item {
          position: relative;
          border-bottom: rgba(255, 255, 255, 0.06) 1px solid;
          padding: 10px 20px;
          box-sizing: border-box;

          &:after {
            content: none;
          }

          &:hover {
            background: var(--bg-color-353435);
          }

          .dot {
            position: absolute;
            top: 17px;
            left: 10px;
            background: #f66;
            width: 6px;
            height: 6px;
            border-radius: 20px;
          }

          .title {
            font-size: 14px;
            color: var(--font-color-f5f5f5);
          }

          .content {
            font-size: 12px;
            color: #b1b1b1;
            margin: 5px 0 10px 0;
            width: 320px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .time {
            font-size: 12px;
            color: var(--font-color-525152);
          }
        }
      }

      .bottom {
        height: 50px;
        line-height: 50px;
        background-color: var(--theme-color);
        border-radius: 0 0 10px 10px;
        font-size: 14px;
        color: var(--font-color-fff);
        text-align: center;
      }
    }
  }
}
</style>
