<template>
  <Dialog ref="dialogRef" :title="$t(`请您登入或者注册{0}账号`, [subConfig.title])" v-model="modelValue" width="800px"
    :showBtn="false" customeClass="login-dialog" contentPadding="40px 40px 30px" titlePadding="0">
    <div class="login-wrap-body">
      <!-- <p class="layout-flex-center login-wrap-title">
        <span
          v-for="(item, index) in tab.list"
          :key="index"
          @click="tab.activeKey = index"
          :class="tab.activeKey === index ? 'active' : ''"
        >{{ item }}</span>
      </p>-->
      <el-form v-if="tab.activeKey === 0" ref="loginForm" label-position="left" class="login-wrap-body-form"
        label-width="108px" :model="data.accountForm" :rules="data.rules">
        <el-form-item :label="$t('用户名')" prop="loginName">
          <el-input v-model="data.accountForm.username" placeholder />
        </el-form-item>
        <el-form-item :label="$t('密码')" prop="password" @keyup.enter="doLogin">
          <el-input v-model="data.accountForm.password" type="password" :show-password="true" placeholder />
        </el-form-item>
      </el-form>
      <el-form v-if="tab.activeKey === 1" ref="phoneForm" label-position="left" class="login-wrap-body-form"
        label-width="108px" :model="data.mobileForm" :rules="data.mobileRules">
        <el-form-item :label="$t('手机号码')" prop="userName" class="form-phoneselect">
          <el-input v-model="data.mobileForm.mobile" placeholder>
            <template #prefix>
              <i class="el-icon-plus"></i>
              <el-select v-model="data.mobileForm.phone_area_code" :placeholder="$t('请选择')"
                popper-class="phone-area-code-select" prefix="el-icon-plus">
                <el-option v-for="(item, index) in dicts?.phoneareav3" :key="index" :value="item.split('-')[2]">
                  <span>{{ item.split("-")[1] }}</span>
                  <span>{{ item.split("-")[2] }}</span>
                </el-option>
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('验证码')" prop="password" class="form-sendcode">
          <el-input v-model="data.mobileForm.code" placeholder @keyup.enter="doLogin" />
          <el-button class="login-wrap-body-form-code" @click="getCode('mobile')" :disabled="num < 60"
            :loading="smsLoading">{{ $t('获取验证码') }}{{ num === 60 ? '' : `(${num})` }}</el-button>
        </el-form-item>
      </el-form>
      <div class="login-bottom">
        <el-button type="primary" v-loading="user.loginLoading" @click="doLogin">{{ $t('登录') }}</el-button>
        <p class="layout-flex-between login-wrap-body-forget">
          <span @click="$dialog({ tpl: 'ForgetPassword' })">{{ $t('忘记密码?') }}</span>
          <span @click="$attrs?.unmount?.()">{{ $t('立即注册') }}</span>
        </p>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import {
  reactive, ref, inject,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useInterval } from '@/utils/hooks';
import { smscode } from '@/api/center';
import Dialog from './index.vue';

const global = inject('global');
const $store = inject('store');
const dialogRef = ref(null);
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});
const subConfig = inject('subConfig');

const tab = reactive({
  list: [global.$t(`账号密码登录`)], // , global.$t(`手机快捷登录`)
  activeKey: 0,
});

$store.dispatch('app/getDict', ['phoneareav3']);
const { user } = $store.state;
const { dicts } = $store.state.app;

const data = reactive({
  accountForm: {
    username: '',
    password: '',
  },
  rules: {
    username: [
      { required: true, message: global.$t('请输入用户名'), trigger: 'blur' },
    ],
    password: [
      { required: true, message: global.$t('请输入密码'), trigger: 'blur' },
    ],
  },
  mobileForm: {
    phone_area_code: 86,
    mobile: null,
    code: '',
  },
  mobileRules: {
    mobile: [
      {
        required: true,
        trigger: 'blur',
        message: global.$t('请输入电话号码'),
      },
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const regNum = new RegExp('^[0-9]*$');
          if (!value) {
            return callback(new Error(global.$t('请输入电话号码')));
          } if (!regNum.test(value)) {
            return callback(new Error(global.$t('手机号必须为数字')));
          }
          return callback();
        },
      },
    ],
    code: [
      { required: true, message: global.$t('请输入验证码'), trigger: 'blur' },
    ],
  },
  phone: [],
  phoneCode: '+86',
});
const loginForm = ref(null);
const phoneForm = ref(null);

// 获取验证码
const num = ref(60);
const { run: runInterval, stop: stopInterval } = useInterval(() => {
  num.value -= 1;
  if (num.value === 0) {
    stopInterval();
    num.value = 60;
  }
}, 1000, { manual: true });
const { run: smsRun, loading: smsLoading } = useRequest(smscode, {
  manual: true,
  onSuccess: () => {
    runInterval();
  },
});
function getCode() {
  smsRun({
    mobile: phoneForm.value.model.mobile,
    phone_area_code: phoneForm.value.model.phone_area_code.toString(),
  });
  // phoneForm.value.validateField('mobile', (valid) => {
  //   if (!valid) {
  //     smsRun({
  //       mobile: phoneForm.value.model.mobile,
  //       phone_area_code: phoneForm.value.model.phone_area_code,
  //     });
  //   }
  // });
}

const emit = defineEmits(['update:modelValue']);
function doLogin() {
  if (tab.activeKey === 0) {
    loginForm.value.validate((valid) => {
      if (valid) {
        $store.dispatch('user/login', data.accountForm).then(() => {
          dialogRef.value.handleCancel();
          global.$router.push('/');
        });
      } else {
        return false;
      }
    });
  } else {
    phoneForm.value.validate((valid) => {
      if (valid) {
        $store.dispatch('user/mobileLogin', data.mobileForm).then(() => {
          dialogRef.value.handleCancel();
          global.$router.push('/');
        });
      } else {
        return false;
      }
    });
  }
}

</script>

<style lang="scss" scoped>
.login-dialog {
  .el-dialog__header {
    background-color: var(--theme-color);
    height: 80px;
    border-radius: 10px 10px 0 0;
    line-height: 80px;
    color: var(--font-color-fff);
    padding-left: 40px;

    .el-dialog-title {
      margin: 0;
      font-size: 20px;
      font-weight: normal;
      color: var(--font-color-fff);
    }
  }

  .login-wrap-title {
    justify-content: flex-start;
    margin: 27px 0 60px;

    span {
      text-align: center;
      font-size: 16px;
      font-family: SourceHanSansCN, SourceHanSansCN-Normal;
      font-weight: Normal;
      color: var(--font-color-999);
      line-height: 27px;
      position: relative;
      cursor: pointer;
      margin-right: 46px;

      &::after {
        content: "";
        position: absolute;
        width: 0;
        transition: linear 0.3s;
        border-bottom: 2px solid var(--theme-color);
        bottom: -14px;
        left: 50%;
        transform: translateX(-50%);
      }

      &.active {
        font-size: 18px;
        font-weight: bold;
        color: var(--font-color-333);

        &::after {
          width: 30px;
        }
      }
    }
  }

  .el-form {
    :deep(.el-form-item__content > .el-input) {
      width: 480px;
    }

    :deep() {
      .el-form-item {
        align-items: center;
      }

      .el-input__inner {
        background-color: transparent;
        border: 1px solid var(--border-color-efefef);
        border-radius: 0;
      }

      .el-form-item__label {
        font-size: 20px;
        font-weight: normal;
        padding-right: 0;

        &:before {
          content: none !important;
        }
      }

      .form-sendcode {
        position: relative;

        .login-wrap-body-form-code {
          position: absolute;
          right: 130px;
          top: 0;
          border: 0;
          font-weight: normal;
          background-color: transparent;
        }
      }

      .form-phoneselect {
        .el-input__inner {
          padding-left: 95px;
        }

        .el-icon-plus {
          margin-left: 10px;
          color: var(--font-color-333);
        }

        .el-select {
          width: 65px;

          .el-input__inner {
            width: 100%;
            border: 0;
            padding: 0 20px 0 0;
            box-sizing: border-box;
          }
        }
      }
    }
  }

  .login-bottom {
    width: 480px;
    margin: 38px 0 0 108px;

    .el-button {
      width: 100%;
      border-radius: 0;
      min-height: 32px;
      padding: 0;
      font-size: 14px;
      color: var(--font-color-fff);
    }
  }

  .login-wrap-body-forget {
    margin-top: 25px;

    span {
      cursor: pointer;
    }

    span:last-child {
      color: var(--theme-color);
    }
  }

  .login-wrap-body-title {
    width: 600px;
    margin: 28px 0 59px;

    p {
      width: 140px;
      margin: 0 auto;
      text-align: center;
      font-size: 16px;
      font-family: SourceHanSansCN, SourceHanSansCN-Normal;
      font-weight: Normal;
      color: var(--font-color-333);
      line-height: 27px;
      position: relative;
      cursor: pointer;

      &::after {
        content: "";
        width: 30px;
        position: absolute;
        bottom: -12px;
        left: 55px;
        display: block;
        transition: linear 0.3s;
        border-bottom: 2px solid transparent;
      }
    }

    p.active {
      font-size: 18px;
      font-weight: 600;
      color: var(--font-color-333);
      line-height: 27px;

      &::after {
        border-bottom-color: var(--theme-color);
      }
    }
  }
}
</style>
