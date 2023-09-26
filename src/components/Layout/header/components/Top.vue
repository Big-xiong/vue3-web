<template>
  <div>
    <div class="align-center-wrap layout-flex-between top-wrap">
      <div class="top-wrap-left">
        <div @click="$router.push('/appDownload')">
          <img src="/src/assets/images/header/phone.png" alt="phone" />
          <span>{{ $t(`程序下载`) }}</span>
        </div>
        <div @click="$router.push({ name: 'helpQuestion', query: { id: '0-0' } })">
          <span>{{ $t(`常见问题`) }}</span>
        </div>
        <div @click="openLanding">
          <span>{{ $t(`联盟合作`) }}</span>
        </div>
      </div>
      <template v-if="user?.isLogin">
        <User @logout="isLogin = false" />
      </template>
      <template v-else-if="refresh">
        <ul class="top-wrap-right">
          <li>
            <el-input v-model="data.username" size="small" :placeholder="$t('用户名')" />
          </li>
          <li>
            <el-input v-lang:en="'width: 200px;'" v-lang:vi="'width: 200px;'" v-model="data.password" type="password"
              size="small" :placeholder="$t('密码')" @keyup.enter="handleLogin">
              <template #suffix>
                <span class="loss-pass-word" @click="$dialog({ tpl: 'ForgetPassword' })">{{ $t(`忘记?`) }}</span>
              </template>
            </el-input>
          </li>
          <li>
            <el-button @click="handleLogin" :loading="user.loginLoading" type="primary">{{ $t(`登入`) }}</el-button>
          </li>
          <li>
            <p @click="$router.push('/register')">{{ $t(`立刻开户`) }}</p>
          </li>
        </ul>
      </template>
      <ModeSwitch v-if="subConfig.isSwitchDark && isDev" />
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, ref,
} from 'vue';
import Cookies from 'js-cookie';
import { useRoute } from 'vue-router';
import { useRefresh } from '@/utils/hooks';
import ForgetPassword from '@/components/Dialog/ForgetPassword.vue';
import Dialog from '@/components/Dialog/index.vue';
import ModeSwitch from '@/components/Layout/header/components/ModeSwitch.vue';
import User from './User.vue';

const global = inject('global');
const $store = inject('store');
const subConfig = inject('subConfig');
const { app, user } = global.$store.state;

const isDev = import.meta.env.DEV;

const { refresh } = useRefresh();

const data = reactive({
  username: '',
  password: '',
});

function handleLogin() {
  if (!data.username) {
    global.$message.error(global.$t(`请输入用户名！`));
    return false;
  }
  if (!data.password) {
    global.$message.error(global.$t(`请输入密码！`));
    return false;
  }
  $store.dispatch('user/login', data).then(() => {
    global.$router.push('/');
  });
}

const route = useRoute();

function openLanding() {
  const landing = global.$router.resolve({ name: 'agentLanding', query: route.query });
  window.open(landing.href, '_blank');
}
</script>

<style lang="scss" scoped>
.top-wrap {
  height: 49px;
  color: var(--font-color-fff);

  :deep(.el-input) {
    width: 131px;
    margin-left: 9px;
    background-color: transparent;

    input {
      height: 30px;
      padding: 0 10px;
      border: 1px solid var(--input-border-color);
      background-color: transparent;
      border-radius: 6px;
      color: var(--font-color-fff);

      &:hover,
      &:focus {
        border-color: var(--theme-color);
      }
    }
  }

  .top-wrap-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 13px;

    div {
      padding-right: 29px;

      img {
        width: 8px;
        height: 14px;
        margin-right: 8px;
        vertical-align: middle;
      }

      span {
        cursor: pointer;
      }
    }
  }

  .top-wrap-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-left: auto;

    li {
      :deep(.el-button) {
        border: 1px solid var(--input-border-color);
        margin-left: 9px;
        min-height: 30px;
        height: 30px;
        line-height: 28px;
        padding: 0 9px;
        background: transparent;
        color: var(--font-color-fff);
        font-size: 13px;
        border-radius: 6px;
      }

      :deep(.el-switch) {
        margin-left: 22px;
        height: 18px;
        line-height: 18px;

        &.is-checked .el-switch__core .el-switch__action {
          margin-left: -15px;
        }

        .el-switch__core {
          height: 18px;
          line-height: 18px;

          .el-switch__action {
            width: 14px;
            height: 14px;
          }
        }
      }

      p {
        margin-left: 10px;
        padding: 0 10px;
        height: 30px;
        font-size: 13px;
        font-family: var(--font-family-bold);
        background: var(--theme-color);
        font-weight: var(--font-weight-700);
        border-radius: 6px;
        color: var(--font-color-fff);
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }

      :deep(.el-input__suffix) {
        right: 10px;
      }

      .loss-pass-word {
        position: relative;
        cursor: pointer;
        display: inline-block;
        color: var(--theme-color);

        &::before {
          position: absolute;
          content: '';
          left: -5px;
          top: 50%;
          margin-top: -7px;
          display: block;
          width: 1px;
          height: 14px;
          border-right: 1px solid var(--border-color-fff);
          box-sizing: border-box;
        }
      }
    }
  }
}
</style>
