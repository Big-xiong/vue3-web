<template>
  <Wrap
    :tabs="tabs"
    v-model:activeName="data.activeName"
    v-model="user.loginDialog"
    :confirmLoading="user.loginLoading"
    :confirmText="$t('登录')"
    :cancelText="$t('立即注册')"
    :forgetpassUsername="data.accountForm.username"
    :footerMargin="true"
    @tabs-change="(key) => (data.activeName = key)"
    @onConfirm="doLogin"
    @onClose="() => $store.commit('user/SET_LOGIN_DIALOG', false)"
    @onCancel="goRegister"
  >
    <template #tab1>
      <el-form ref="loginForm" :rules="data.rules" :model="data.accountForm">
        <el-form-item prop="username">
          <el-input v-model="data.accountForm.username" :placeholder="$t('请输入账号')">
            <template #prefix>
              <svg-icon name="icon_login_user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="data.accountForm.password" @keyup.enter="doLogin" :placeholder="$t('请输入密码')">
            <template #prefix>
              <svg-icon name="icon_login_pass" />
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #tab2>
      <el-form ref="phoneForm" :rules="data.mobileRules" :model="data.mobileForm">
        <el-form-item prop="mobile">
          <div class="phone-area-code">
            <el-input v-model="data.mobileForm.mobile" :placeholder="$t('请输入电话号码')">
              <template #prefix>
                <!-- <i class="el-input__icon el-icon-mobile"></i> -->
                <svg-icon name="icon_login_shouji" />
                <i class="el-icon-plus"></i>
                <span class="line"></span>
                <el-select
                  v-model="data.mobileForm.phone_area_code"
                  :placeholder="$t('请选择')"
                  popper-class="phone-area-code-select"
                  prefix="el-icon-plus"
                >
                  <el-option v-for="(item, index) in dicts?.phoneareav3" :key="index" :value="item.split('-')[2]">
                    <span>{{ item.split('-')[1] }}</span>
                    <span>{{ item.split('-')[2] }}</span>
                  </el-option>
                </el-select>
              </template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item prop="code">
          <div class="layout-flex-center layout-sendcode">
            <el-input v-model="data.mobileForm.code" @keyup.enter="doLogin" :placeholder="$t('请输入验证码')">
              <template #prefix>
                <svg-icon name="icon_login_yzm" />
              </template>
            </el-input>
            <el-button @click="getCode" :disabled="running" :loading="smsLoading" type="primary">
              {{ !running ? '获取验证码' : '获取验证码(' + num + ')' }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </template>
  </Wrap>
</template>
<script setup>
import { inject, reactive, ref, watch } from 'vue';
import { useRequest } from 'ahooks-vue';
import { smscode } from '@/api/center';
import { useInterval } from '@/utils/hooks';
import Wrap from './components/Wrap.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const { dicts } = $store.state.app;
$store.dispatch('app/getDict', ['phoneareav3']);

const tabs = [
  { label: global.$t('账号密码登录'), name: 'account' },
  { label: global.$t('手机快捷登录'), name: 'mobile' }
];

const data = reactive({
  activeName: 'account',
  accountForm: {
    username: '',
    password: ''
  },
  rules: {
    username: [{ required: true, message: global.$t('请输入账号'), trigger: 'blur' }],
    password: [{ required: true, message: global.$t('请输入密码'), trigger: 'blur' }]
  },
  mobileForm: {
    phone_area_code: 86,
    mobile: null,
    code: ''
  },
  mobileRules: {
    mobile: [
      {
        required: true,
        trigger: 'blur',
        message: global.$t('请输入电话号码')
      },
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const regNum = new RegExp('^[0-9]*$');
          if (!value) {
            return callback(new Error(global.$t('请输入电话号码')));
          }
          if (!regNum.test(value)) {
            return callback(new Error(global.$t('手机号必须为数字')));
          }
          return callback();
        }
      }
    ],
    code: [{ required: true, message: global.$t('请输入验证码'), trigger: 'blur' }]
  },
  phone: [],
  phoneCode: '+86'
});
const loginForm = ref(null);
const phoneForm = ref(null);

watch(
  () => user.loginActiveName,
  (val) => {
    data.activeName = val;
  },
  { immediate: true }
);

const num = ref(60);
const { run, stop, running } = useInterval(
  () => {
    num.value -= 1;
    if (num.value <= 0) {
      stop();
      num.value = 60;
    }
  },
  1000,
  { manual: true }
);

// 获取验证码
const { run: smsRun, loading: smsLoading } = useRequest(smscode, {
  manual: true,
  onSuccess: run
});

function getCode() {
  phoneForm.value.validateField('mobile', (valid) => {
    if (!valid) {
      smsRun({
        mobile: phoneForm.value.model.mobile,
        phone_area_code: phoneForm.value.model.phone_area_code
      });
    }
  });
}

function doLogin() {
  console.log(111);
  if (data.activeName === 'account') {
    loginForm.value.validate((valid) => {
      if (valid) {
        $store.dispatch('user/login', data.accountForm).then((res) => {
          if (res) {
            global.$router.push({ name: 'centerHome' });
          }
          console.log('login', res);
        });
      } else {
        return false;
      }
    });
  } else {
    phoneForm.value.validate((valid) => {
      if (valid) {
        $store.dispatch('user/mobileLogin', data.mobileForm).then((res) => {
          if (res) {
            global.$router.push({ name: 'centerHome' });
          }
        });
      } else {
        return false;
      }
    });
  }
}

function goRegister() {
  global.$router.push({ name: 'register' });
  global.$store.commit('user/SET_LOGIN_DIALOG', false);
}
</script>
<style lang="scss" scoped>
:deep(.el-icon-plus) {
  &::before {
    font-size: 10px;
  }

  transform: translateY(-2px);
  margin-right: 10px;
  font-size: 16px;
}

:deep(.el-dialog__close) {
  color: var(--theme-color) !important;
}

:deep(.el-select) {
  .el-input__inner {
    font-size: 16px !important;
    color: var(--info-color);
  }
}

.layout-sendcode {
  .el-button--primary {
    height: 50px;
    margin-left: 13px;
    // color: var(--font-color-8b98a9);
  }
}
</style>
