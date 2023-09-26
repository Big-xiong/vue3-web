<template>
  <Wrap v-model:show="currencyShow" :modal="false" :show-close="false" :lock-scroll="false" :tabs="tabs"
    :activeName="data.activeName" :confirmLoading="user.registerLoading" @onConfirm="doRegister" :confirmText="$t('注册')"
    :cancelText="$t('已有账号？请登录')" @onClose="goLogin" @tabsChange="(name) => (data.activeName = name)"
    :class="{ 'footer-bottom': data.activeName === 'mobile' }">
    <template #tab1>
      <el-form ref="accountForm" :rules="data.accountRules" :model="data.accountForm">
        <el-form-item prop="username">
          <el-input v-model="data.accountForm.username" :placeholder="$t('请输入账号')">
            <template #prefix>
              <svg-icon name="icon_login_user" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="data.accountForm.password" @keyup.enter="doLogin"
            :placeholder="$t('请输入密码')">
            <template #prefix>
              <svg-icon name="icon_login_pass" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input type="password" v-model="data.accountForm.repassword" @keyup.enter="doRegister"
            :placeholder="$t('请再次输入密码')">
            <template #prefix>
              <svg-icon name="icon_login_pass" />
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="clause">
          <Checkbox v-model:checked="data.accountForm.clause" :label="$t(`注册并接受《{0}娱乐游戏条款》`, [subConfig.title])" />
        </el-form-item>
      </el-form>
    </template>
    <template #tab2>
      <div class="quick-register">
        <el-form ref="quickForm" :rules="data.quickRules" :model="data.accountForm">
          <el-form-item prop="clause">
            <Ship @click="doRegister" />
            <p class="quick-register-tips">{{ $t(`一键开户，体验{0}娱乐`, [subConfig.title]) }}</p>
            <Checkbox v-model:checked="data.accountForm.clause" :label="$t(`注册并接受《{0}娱乐游戏条款》`, [subConfig.title])" />
          </el-form-item>
        </el-form>
      </div>
    </template>
    <template #tab3>
      <el-form ref="mobileForm" :model="data.mobileForm" :rules="data.mobileRules">
        <el-form-item prop="mobile">
          <div class="phone-area-code">
            <el-input v-model="data.mobileForm.mobile" :placeholder="$t('请输入电话号码')">
              <template #prefix>
                <!-- <i class="el-input__icon el-icon-mobile"></i> -->
                <svg-icon name="icon_login_shouji" />
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
          </div>
        </el-form-item>
        <el-form-item prop="code">
          <div class="layout-flex-center layout-sendcode">
            <el-input v-model="data.mobileForm.code" @keyup.enter="doRegister" :placeholder="$t('请输入验证码')">
              <template #prefix>
                <svg-icon name="icon_login_yzm" />
              </template>
            </el-input>
            <el-button @click="getCode" :disabled="num < 60" :loading="smsLoading" type="primary">{{ $t(`获取验证码`) }}{{
                num === 60 ? '' : `(${num})`
            }}</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <Checkbox v-model:checked="data.accountForm.clause" :label="$t(`注册并接受《{0}娱乐游戏条款》`, [subConfig.title])" />
        </el-form-item>
      </el-form>
    </template>
  </Wrap>
</template>
<script setup>
import {
  inject, reactive, ref, getCurrentInstance, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Checkbox from '@/components/Checkbox/index.vue';
import { useInterval } from '@/utils/hooks';
import { smscode } from '@/api/center';
import Ship from './Ship.vue';
import Wrap from './Wrap.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const subConfig = inject('subConfig');
const currencyShow = ref(false);
const needMobileVerify = ref(true);
const needUsernameVerify = ref(false);
const registerType = ref(1);
watch(() => user.isLogin, (isLogin) => {
  if (!isLogin) {
    currencyShow.value = true;
  }
}, { immediate: true });
$store.dispatch('app/getDict', ['phoneareav3', 'siteinfo']);
const { dicts } = $store.state.app;
watch(() => dicts.siteinfo, (info) => {
  needMobileVerify.value = info.pc_register_setting.quick_register !== '1';
  needUsernameVerify.value = info.pc_register_setting.username_register !== '1';
  registerType.value = info.pc_register_setting.quick_register;
}, { immediate: true });
const accountForm = ref(null);
const quickForm = ref(null);
const mobileForm = ref(null);
const { attrs } = getCurrentInstance();
const tabs = [
  { label: global.$t('账户注册'), name: 'account' },
  { label: global.$t('一键注册'), name: 'quick' },
  { label: global.$t('手机号注册'), name: 'mobile' },
];
const data = reactive({
  activeName: 'account',
  accountForm: {
    clause: true,
    username: '',
    password: '',
    repassword: '',
    id: sessionStorage.getItem('agentCode') || '',
    spread_code: sessionStorage.getItem('spread_code') || '',
  },
  accountRules: {
    clause: [
      {
        trigger: 'change',
        validator: clauseCheck,
      },
    ],
    username: [
      { required: true, message: global.$t('请输入账号'), trigger: 'blur' },
    ],
    password: [
      { required: true, message: global.$t('请输入密码'), trigger: 'blur' },
    ],
    repassword: [
      {
        trigger: 'blur',
        validator: pwdCheck,
      },
    ],
  },
  quickRules: {
    clause: [
      {
        trigger: 'change',
        validator: clauseCheck,
      },
    ],
  },
  mobileForm: {
    domain: document.domain,
    mobile: null,
    code: null,
    phone_area_code: 86,
    id: sessionStorage.getItem('agentCode') || '',
    spread_code: sessionStorage.getItem('spread_code') || '',
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
});
function clauseCheck(rule, value, callback) {
  if (!value) {
    callback(new Error(global.$t('请同意并勾选服务条款!')));
  } else {
    callback();
  }
}
function pwdCheck(rule, value, callback) {
  if (value === '') {
    callback(new Error(global.$t('请再次输入密码')));
  } else if (value !== data.accountForm.password) {
    callback(new Error(global.$t('两次输入密码不一致!')));
  } else {
    callback();
  }
}
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
  // console.log('getCode');
  mobileForm.value.validateField('mobile', (valid) => {
    if (!valid) {
      smsRun({
        mobile: mobileForm.value.model.mobile,
        phone_area_code: mobileForm.value.model.phone_area_code,
      });
    }
  });
}
function handleCloseLogin() {
  $store.commit('user/SET_LOGIN_DIALOG', false);
}
const loginForm = ref(null);
function goLogin() {
  // global.$store.commit('user/SET_LOGIN_DIALOG', true);
  $store.commit('user/SET_LOGIN_DIALOG', true);
}
const config = {
  mobile: mobileForm,
  account: accountForm,
  quick: '',
};
async function doRegister() {
  if (!data.accountForm.clause) {
    global.$message.error(global.$t('请勾选游戏条款'));
    return;
  }
  if (user.registerLoading) return;
  if (data.activeName === 'quick') {
    if (needMobileVerify.value) {
      global.$dialog({
        tpl: 'BindMobile',
        registerType: registerType.value * 1,
        accountData: {
          name: 'quick',
          data: {},
        },
        callback(res) {
          $store.dispatch('user/register', {
            name: data.activeName,
            data: { id: sessionStorage.getItem('agentCode'), ...res },
          }).then(() => {
            global.$router.push({ name: 'registerSuccess' });
          });
        },
      });
      return;
    }
    const result = await $store.dispatch('user/register', {
      name: data.activeName,
      data: { id: sessionStorage.getItem('agentCode') },
    });
    if (result) {
      global.$router.push({ name: 'registerSuccess' });
    }
  } else {
    config[data.activeName].value.validate(async (valid) => {
      if (valid) {
        if (needUsernameVerify.value && data.activeName === 'account') {
          global.$dialog({
            tpl: 'BindMobile',
            registerType: registerType.value * 1,
            accountData: {
              name: 'account',
              data: { ...data.accountForm },
            },
          });
          return;
        }
        const result = await $store.dispatch('user/register', {
          name: data.activeName,
          data: data.activeName === 'mobile' ? {
            ...data.mobileForm,
            id: sessionStorage.getItem('agentCode'),
          } : {
            ...data.accountForm,
          },
        });
        if (result) {
          global.$router.push({ name: 'registerSuccess' });
        }
      }
    });
  }
}
</script>
<style lang="scss" scoped>
.quick-register {
  margin: 0 60px;

  &-tips {
    text-align: center;
    color: var(--font-color-999);
    font-size: 16px;
    margin: 0;
  }

  :deep(.el-form-item) {
    margin-bottom: 10px !important;
  }
}

:deep(.el-button) {
  color: var(--font-color-fff);
}

:deep(.el-select) {
  .el-input__inner {
    font-size: 16px !important;
    margin-left: 8px;
    color: var(--info-color);
  }
}

:deep(.el-icon-plus) {
  &::before {
    font-size: 10px;
  }

  transform: translateY(-2px);
  font-size: 16px;
}

.footer-bottom {
  :deep(.login-dialog-footerTips) {
    margin-top: 60px !important;
  }
}

:deep(.check-box-wrap) {
  justify-content: center;

  .check-box-label.checked {

    &::before,
    &::after {
      background-color: var(--bg-color-1c385c);
    }
  }
}

.layout-sendcode {
  .el-button--primary {
    height: 50px;
    margin-left: 13px;
  }
}
</style>
