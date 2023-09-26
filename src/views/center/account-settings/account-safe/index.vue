<template>
  <div class="account-safe-wrap">
    <div class="layout-flex-center account-safe-wrap-tips">
      <svg-icon name="tips"></svg-icon>
      <!-- <img
                src="/src/assets/images/center/accountSafe/tips.png"
                alt=""
      >-->
      <span>{{ $t('为了确保您的账号安全，请您填写相关信息，以备不时之需') }}</span>
    </div>
    <div class="layout-flex-center account-safe-wrap-items">
      <!-- <img
                src="/src/assets/images/center/accountSafe/icon1.png"
                alt=""
      >-->
      <!--      <span-->
      <!--        :style="{ 'background-image': `url(${$getSrc('/src/assets/images/center/accountSafe/icon1.png')})` }"-->
      <!--      ></span>-->
      <svg-icon name="safe-password" />
      <div>
        <h2>{{ $t('登录密码') }}</h2>
        <p>{{ $t('修改登录时的密码，定期修改有利于账户安全') }}</p>
      </div>
      <el-button
        type="primary"
        @click="showPassDia = true"
      >{{ $t('修改') }}</el-button>
    </div>
    <div class="layout-flex-center account-safe-wrap-items">
      <!-- <img
                src="/src/assets/images/center/accountSafe/icon2.png"
                alt=""
      >-->
      <!--      <span-->
      <!--        :style="{ 'background-image': `url(${$getSrc('/src/assets/images/center/accountSafe/icon2.png')})` }"-->
      <!--      ></span>-->
      <svg-icon name="safe-pay" />
      <div>
        <h2>{{ $t('资金密码') }}</h2>
        <p>{{ $t('为了您的资金安全，设置后能够保障账户安全') }}</p>
      </div>
      <el-button
        type="primary"
        @click="showMoneyPassDia = true"
      >{{ user.userInfo.is_pay_password === 2 ? $t('修改资金密码') : $t('设置资金密码') }}</el-button>
    </div>
    <div class="layout-flex-center account-safe-wrap-items">
      <!-- <img
                src="/src/assets/images/center/accountSafe/icon3.png"
                alt=""
      >-->
      <!--      <span-->
      <!--        :style="{ 'background-image': `url(${$getSrc('/src/assets/images/center/accountSafe/icon3.png')})` }"-->
      <!--      ></span>-->
      <svg-icon name="safe-question" />
      <div>
        <h2>{{ $t('密保问题') }}</h2>
        <p>{{ $t('为了防止您忘记登录密码、资金密码等可以进行验证找回') }}</p>
      </div>
      <el-button
        type="primary"
        @click="user?.userInfo?.is_pass_answer === 1 ? showPassQuesDia = true : showValidateDia = true"
      >{{ user.userInfo.is_pass_answer === 2 ? $t('修改密保问题') : $t('设置密保问题') }}</el-button>
    </div>
    <div
      class="layout-flex-center account-safe-wrap-items"
      v-if="subConfig.isCurrency"
    >
      <!--      <img src="/src/assets/images/center/accountSafe/icon4.png" alt />-->
      <svg-icon name="safe-region" />
      <div>
        <h2>{{ $t('地区') }}</h2>
      </div>
      <i>{{ dicts?.regionlist?.filter(item => item.id === user?.userInfo?.inte_region_id)[0]?.name }}</i>
    </div>
    <div
      class="layout-flex-center account-safe-wrap-items"
      v-if="subConfig.isCurrency"
    >
      <!--      <img src="/src/assets/images/center/accountSafe/icon5.png" alt />-->
      <svg-icon name="safe-currency" />
      <div>
        <h2>{{ $t('货币') }}</h2>
      </div>
      <i>{{ dicts?.regionlist?.filter(item => item.id === user?.userInfo?.inte_region_id)[0]?.currency_conf?.list?.filter(child => child.id === user?.userInfo?.inte_currency_id)[0].name }}</i>
    </div>

    <PasswordSetComponent
      v-if="showPassDia"
      :showPassDia="showPassDia"
      @closePassDia="showPassDia = false"
    />
    <MoneyPasswordSetComponent
      v-if="showMoneyPassDia"
      :showMoneyPassDia="showMoneyPassDia"
      @closeMoneyPassDia="showMoneyPassDia = false"
    />
    <PasswordQuestionComponent
      v-if="showPassQuesDia"
      :showPassQuesDia="showPassQuesDia"
      @closePassQuesDia="showPassQuesDia = false"
    />
    <ValidateComponent
      v-if="showValidateDia"
      :showValidateDia="showValidateDia"
      @closeValidateDia="showValidateDia = false"
      @closeDia="showValidateDia = false"
      @validTrue="showPassQuesDia = true"
    />
  </div>
</template>

<script setup>
import {
  computed, inject, reactive, ref,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import ValidateComponent from '@/components/ValidateIdentity/index.vue';
import SvgIcon from '../../../../components/SvgIcon.vue';
import PasswordSetComponent from './components/PasswordSet.vue';
import MoneyPasswordSetComponent from './components/MoneyPasswordSet.vue';
import PasswordQuestionComponent from './components/PasswordQuestion.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const { dicts } = $store.state.app;
$store.dispatch('app/getDict', ['regionlist']);
const subConfig = inject('subConfig');

const showPassDia = ref(false);
const showMoneyPassDia = ref(false);
const showPassQuesDia = ref(false);
const showValidateDia = ref(false);
</script>

<style lang="scss" scoped>
.account-safe-wrap {
  color: var(--font-color-ccc);

  &-tips {
    justify-content: flex-start;
    font-size: 16px;
    background-color: var(--bg-color-efefef);
    border-radius: 6px;
    line-height: 22px;
    padding: 19px 30px;
    margin-bottom: 40px;
    color: var(--font-color-000);

    .svg-icon {
      width: 14px;
      height: 14px;
      margin-right: 5px;
      fill: var(--theme-color) !important;
    }
  }

  &-items {
    padding: 0 30px 0 35px;
    min-height: 100px;
    border: 1px solid var(--border-color-000-2);
    border-radius: 6px;
    margin-bottom: 20px;
    box-sizing: border-box;

    i {
      font-size: 28px;
      color: var(--font-color-525152);
    }

    .svg-icon {
      width: 30px;
      height: 30px;
      fill: var(--bg-color-999);
    }

    div {
      flex: 1;
      margin: 0 35px;

      h2 {
        font-size: 20px;
        margin: 0 0 5px;
        padding: 0;
        line-height: 28px;
        font-weight: 600;
        color: var(--font-color-000);
      }

      p {
        font-size: 12px;
        margin: 0;
        line-height: 17px;
        color: var(--font-color-8B98A9, var(--font-color-000));
      }
    }

    .el-button {
      min-width: 140px;
    }

    i {
      font-size: 20px;
      margin: 0 0 5px;
      padding: 0;
      line-height: 28px;
      font-weight: 600;
      color: var(--font-color-000);
      font-style: normal;
    }
  }
}
</style>
