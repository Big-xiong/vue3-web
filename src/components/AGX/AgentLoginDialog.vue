<template>
  <el-dialog
    v-model="dialogVisible"
    width="500px"
    :append-to-body="true"
    :destroy-on-close="true"
    @close="closeHandle"
    custom-class="agx-agent-login-dialog"
  >
    <div class="agent-login-dialog-content" v-loading="loginLoading || registerLoding">
      <el-tabs v-model="crtType">
        <el-tab-pane :label="$t('代理登录')" name="login">
          <div class="login-wrap">
            <el-input v-model="loginData.username" placeholder="请输入代理账号">
              <template #prefix>
                <img :src="$getSrc('/src/current_project/assets/images/agentRegister/icon-user.png')" alt="" />
              </template>
            </el-input>
            <el-input v-model="loginData.password" type="password" placeholder="请输入密码">
              <template #prefix>
                <img :src="$getSrc('/src/current_project/assets/images/agentRegister/icon-pass.png')" alt="" />
              </template>
            </el-input>
            <div class="login" @click="doLogin">{{ $t('登录') }}</div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('代理注册')" name="register">
          <div class="register-wrap">
            <div class="logo"></div>
            <el-input v-model="registerData.username" placeholder="请输入代理账号" />
            <el-input v-model="registerData.password" type="password" placeholder="请输入密码" />
            <el-input v-model="registerData.wechat" placeholder="请输入微信号" />
            <el-input v-model="registerData.skype" placeholder="请输入Skype号" />
            <el-input v-model="registerData.mobile" placeholder="请填写您的手机号码">
              <template #prepend>
                <div class="mobile-code">
                  <div class="icon"></div>
                  <el-select v-model="registerData.phone_area_code" size="mini" popper-class="agent-register-mobile-code">
                    <el-option v-for="(item, index) in dicts?.phoneareav3" :key="index" :value="'+' + item.split('-')[2]">
                      <span>{{ item.split('-')[1] }}</span>
                      <span>+{{ item.split('-')[2] }}</span>
                    </el-option>
                  </el-select>
                </div>
              </template>
            </el-input>
            <div class="check">{{ $t('同意并接受《合作代理条款》') }}</div>
            <el-button class="register" :loading="registerLoding" @click="doRegister">{{ $t('成为代理') }}</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeHandle">Cancel</el-button>
        <el-button type="primary" @click="closeHandle">Confirm</el-button>
      </span>
    </template> -->
  </el-dialog>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import Cookies from 'js-cookie';
import { login, register } from '@/api/agent';
import { getParams } from '@/utils';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;
$store.dispatch('app/getDict', 'phoneareav3');

defineProps({
  dialogVisible: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(['close']);
const closeHandle = () => {
  emit('close');
};

const crtType = ref('login');
const loginData = reactive({
  username: '',
  password: '',
});
const registerData = reactive({
  username: '',
  password: '',
  wechat: '',
  skype: '',
  phone_area_code: '+86',
  mobile: '',
  parent_code: '',
});

// 登录
const { run: postLogin, loading: loginLoading } = useRequest((params) => login(params), {
  manual: true,
  async onSuccess(loginResult) {
    Cookies.set('agent_access_token', loginResult.access_token);
    await $store.dispatch('agent/getUserInfo');
    global.$router.push({ path: '/affiliate/home', replace: true });
  },
});
const doLogin = () => {
  // 校验
  if (loginData.username && loginData.password) {
    postLogin(loginData);
  } else {
    global.$message.error(global.$t('账号或密码不能为空'));
  }
};

// 注册
const { run: postRegister, loading: registerLoding } = useRequest((params) => register(params), {
  manual: true,
  async onSuccess() {
    global.$message.success(global.$t('注册成功！'));
    await postLogin(registerData);
  },
});
function doRegister() {
  // 校验
  if (!registerData.username) {
    return global.$message.error(global.$t('请输入代理帐号'));
  }
  const pwdReg = /^[0-9A-Za-z]{6,20}$/;
  const pwdValide = pwdReg.test(registerData.password);
  if (!pwdValide) {
    return global.$message.error(global.$t('密码由6-20位英文字母或数字组成'));
  }
  if (!registerData.wechat) {
    return global.$message.error(global.$t('请输入微信号'));
  }
  if (!registerData.skype) {
    return global.$message.error(global.$t('清输入Skype号'));
  }
  if (!registerData.mobile) {
    return global.$message.error(global.$t('请输入正确手机号'));
  }
  const phoneAreaCode = registerData.phone_area_code.slice(1); // 去掉+号
  const params = {
    ...registerData,
    phone_area_code: phoneAreaCode,
    register_domain: document.domain,
    repassword: registerData.password,
    id: getParams('id'),
  };
  postRegister(params);
}
</script>
<style lang="scss">
body .el-dialog.agx-agent-login-dialog {
  .el-dialog__close {
    color: var(--agx-agent-login-caret-color) !important;
  }
  .el-dialog__body {
    border-radius: 10px;
    overflow: hidden;
  }
}
</style>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.flex {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
}
.agent-login-dialog-content {
  background-color: var(--dialog-bg-color);
  padding-bottom: 40px;
  :deep(.el-tabs) {
    .el-tabs__header {
      margin-bottom: 40px;
      .el-tabs__nav-scroll {
        padding-left: 89px;
        .el-tabs__item {
          height: 89px;
          line-height: 89px;
          font-size: 24px;
          font-weight: 400;
          color: var(--tab-unactive-color);
          &.is-active {
            color: var(--tab-active-color);
            font-weight: 500;
          }
        }
      }
    }
  }
}
.login-wrap,
.register-wrap {
  width: 380px;
  margin: auto;
  :deep(.el-input) {
    font-size: 14px;
    margin-bottom: 20px;
    width: 380px;
    height: 50px;
    line-height: 50px;
    border-radius: 4px;
    --placeholder-color: var(--agx-agent-login-ph-color);
    --font-color-000: var(--agx-agent-login-font-color);
    &.el-input-group {
      background-color: var(--agx-agent-login-input-bg-color);
    }
    .el-input__inner {
      font-size: 16px;
      border: 1px solid var(--agx-agent-login-input-border-color);
      outline: none;
      height: 50px !important;
      background-color: var(--agx-agent-login-input-bg-color);
      &::placeholder {
        font-size: 16px;
        color: var(--agx-agent-login-ph-color) !important;
      }
    }
    .el-input__prefix {
      padding: 0 13px;
      > img {
        width: 22px;
      }
    }
    .el-input-group__prepend {
      border-color: var(--agx-agent-login-input-border-color);
    }
    .el-input-group__prepend + .el-input__inner {
      border-left: none;
    }
    .mobile-code {
      position: relative;
      left: 20px;
      width: 100px;
      height: 48px;
      line-height: 48px;
      text-align: left;
      color: #000;
      &::after {
        content: '';
        width: 1px;
        height: 20px;
        position: absolute;
        top: 15px;
        right: 0;
        background: var(--agx-agent-login-code-divider-color);
      }
      .icon {
        position: relative;
        left: -23px;
        top: 4px;
        display: inline-block;
        width: 22px;
        height: 22px;
        background: url(@img/agentRegister/phone-code.png) no-repeat center;
        background-size: contain;
      }
      .el-select {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        border: none;
        color: var(--agx-agent-login-select-color);
        .select-trigger {
          position: relative;
          top: -1px;
        }
        .el-input {
          width: 100%;
          .el-input__inner {
            border: none !important;
          }
          .el-select__caret {
            position: relative;
            left: -8px;
            top: 3px;
            font-size: 20px;
            color: var(--agx-agent-login-caret-color);
          }
        }
      }
    }
  }
  .login,
  .register {
    width: 380px;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    background: var(--theme-color);
    border-radius: 4px;
    margin-top: 6px;
    cursor: pointer;
  }
  div.check {
    width: 212px;
    margin: auto;
    margin-top: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 14px;
    color: #ccc;
    padding-left: 30px;
    background: url(@img/agentRegister/check.png) no-repeat left center;
    background-size: contain;
  }
  .register {
    margin-top: 21px;
  }
  > p {
    margin-top: 40px;
    height: 20px;
    font-size: 14px;
    font-weight: 500;
    color: #e0414a;
    line-height: 20px;
    cursor: pointer;
    span {
      text-decoration: underline;
    }
  }
  .register + p {
    margin-top: 30px;
  }
}
.login-wrap {
  :deep(.el-input) {
    .el-input__inner {
      padding-left: 50px;
    }
  }
}
</style>
