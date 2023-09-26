<template>
  <div class="register-box">
    <div class="register-wrap">
      <p class="register-wrap-title">{{ $t(`立即注册，成为人生赢家！`) }}</p>
      <div class="register-wrap-content">
        <div class="register-wrap-content-left">
          <img
            src="@/assets/images/home/brand.png"
            alt
          />
          <div>
            <h2>{{ $t('领导品牌引领精彩人生') }}</h2>
            <p>{{ $t('携手英超纽卡，热刺') }}</p>
            <p>{{ $t('邀你砥砺前行，共鉴辉煌') }}</p>
            <p>{{ $t('马上注册，做天生赢家享精彩人生') }}</p>
            <p>
              <img
                src="@/assets/images/home/cooperation01.png"
                alt
              />
              <img
                src="@/assets/images/home/cooperation02.png"
                alt
              />
            </p>
          </div>
        </div>
        <div class="register-wrap-content-right">
          <!-- <p class="layout-flex-center register-wrap-content-right-title">
            <span
              v-for="(item, index) in tab.list"
              :key="index"
              @click="handlerTab(index)"
              :class="tab.activeKey === index ? 'active' : ''"
            >{{ item }}</span>
          </p>-->
          <el-form
            v-show="tab.activeKey === 0"
            ref="accountForm"
            class="register-wrap-content-right-form"
            :model="data.accountForm"
            :rules="data.accountRules"
            label-position="top"
          >
            <el-form-item
              :label="$t('账户名称')"
              prop="username"
            >
              <el-input
                v-model="data.accountForm.username"
                :placeholder="$t('请输入账号')"
              />
            </el-form-item>
            <el-form-item
              prop="password"
              :label="$t('密码')"
            >
              <el-input
                v-model="data.accountForm.password"
                type="password"
                :show-password="true"
                :placeholder="$t('请输入密码')"
              />
            </el-form-item>
            <el-form-item
              prop="repassword"
              :label="$t('确认密码')"
            >
              <el-input
                v-model="data.accountForm.repassword"
                :placeholder="$t('请再次输入密码')"
                :show-password="true"
                type="password"
              />
            </el-form-item>
            <el-form-item
              prop="mobile"
              :label="$t('手机号码')"
              class="form-phoneselect"
            >
              <el-input
                v-model="data.accountForm.mobile"
                :placeholder="$t('请输入电话号码')"
              >
                <template #prefix>
                  <i class="el-icon-plus"></i>
                  <el-select
                    v-model="data.accountForm.phone_area_code"
                    :placeholder="$t('请选择')"
                    popper-class="phone-area-code-select"
                    prefix="el-icon-plus"
                  >
                    <el-option
                      v-for="(item, index) in phoneareav3"
                      :key="index"
                      :value="item.split('-')[2]"
                    >
                      <span>{{ item.split("-")[1] }}</span>
                      <span>{{ item.split("-")[2] }}</span>
                    </el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              prop="email"
              :label="$t('邮箱')"
            >
              <el-input
                v-model="data.accountForm.email"
                :placeholder="$t('请输入邮箱')"
              />
            </el-form-item>
            <el-form-item prop="id">
              <template #label>
                <p
                  class="pointer"
                  @click="accountRecShow = !accountRecShow"
                >
                  {{ `${$t('推荐码')}(${$t('选填')})` }}
                  <i :class="[accountRecShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom']"></i>
                </p>
              </template>
              <el-input
                v-show="accountRecShow"
                v-model="data.accountForm.id"
                :placeholder="`${$t('推荐码')}(${$t('选填')})`"
              />
            </el-form-item>
          </el-form>
          <el-form
            v-show="tab.activeKey === 1"
            ref="mobileForm"
            class="register-wrap-content-right-form"
            :model="data.mobileForm"
            :rules="data.mobileRules"
            label-position="top"
          >
            <el-form-item
              prop="mobile"
              :label="$t('手机号码')"
              class="form-phoneselect"
            >
              <el-input
                v-model="data.mobileForm.mobile"
                :placeholder="$t('请输入电话号码')"
              >
                <template #prefix>
                  <i class="el-icon-plus"></i>
                  <el-select
                    v-model="data.mobileForm.phone_area_code"
                    :placeholder="$t('请选择')"
                    popper-class="phone-area-code-select"
                    prefix="el-icon-plus"
                  >
                    <el-option
                      v-for="(item, index) in phoneareav3"
                      :key="index"
                      :value="item.split('-')[2]"
                    >
                      <span>{{ item.split("-")[1] }}</span>
                      <span>{{ item.split("-")[2] }}</span>
                    </el-option>
                  </el-select>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item
              prop="code"
              :label="$t('请输入验证码')"
              class="form-getcode"
            >
              <el-input
                v-model="data.mobileForm.code"
                :placeholder="$t('请输入验证码')"
              />
              <el-button
                class="register-wrap-content-right-form-code"
                @click="handlerCode"
                :disabled="running"
                :loading="smsLoading"
              >{{ $t(`获取验证码`) }}{{ num === 60 ? '' : `(${num})` }}</el-button>
            </el-form-item>
            <el-form-item
              prop="id"
              :label="`${$t('推荐码')}(${$t('选填')})`"
            >
              <template #label>
                <p
                  class="pointer"
                  @click="mobileRecShow = !mobileRecShow"
                >
                  {{ `${$t('推荐码')}(${$t('选填')})` }}
                  <i :class="[mobileRecShow ? 'el-icon-caret-top' : 'el-icon-caret-bottom']"></i>
                </p>
              </template>
              <el-input
                v-show="mobileRecShow"
                v-model="data.mobileForm.id"
                :placeholder="$t('请输入推荐码')"
              />
            </el-form-item>
          </el-form>
          <p
            class="register-wrap-content-right-submit"
            v-loading="user.registerLoading"
            @click="handlerSubmit"
          >{{ $t(`注册`) }}</p>
          <div class="register-wrap-content-right-tips">
            <span @click="showTerms">{{ $t(`《合作代理条款》`) }}</span>
            <!-- <el-radio
              v-model="radio1"
              label="1"
            >{{$t(`注册即代表同意《Blizzwin游戏条款》`)}}</el-radio>-->
            <p>
              {{ $t(`已有账号?`) }}
              <span
                class="green"
                @click="global.$dialog({ tpl: 'Login' })"
              >{{ $t(`请登录`) }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <RegisterTerms
      :modelValue="data.isTermsShow"
      @close="data.isTermsShow = false"
    />

    <ChooseCurrency
      :modelValue="currencyShow"
      :registerType="registerType"
      @confirmCurrency="confirmCurrency"
    />
  </div>
</template>

<script setup>
import {
  reactive, ref, inject, computed, onMounted, watch, watchEffect,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Cookies from 'js-cookie';
import { useInterval } from '@/utils/hooks';
import {
  smscode,
} from '@/api/center';
import { siteinfo } from '@/api/dicts';
import { getParams } from '@/utils';
import RegisterTerms from '@/components/Dialog/RegisterTerms.vue';
import ChooseCurrency from './components/ChooseCurrency.vue';
import { spreadcodecurrency } from '@/api/app';
import { getAreaCodeFromRegion } from '../../../utils';

const global = inject('global');
const $store = inject('store');
const { dicts } = $store.state.app;
const { user } = $store.state;
const currencyShow = ref(false);
const radio1 = ref('1');

const tab = reactive({
  list: [global.$t(`账号注册`)], // , global.$t(`手机号注册`)
  activeKey: 0,
});
const code = ref(global.$t(`发送验证码!`));
const formData = reactive({
  username: '',
  password: '',
  repassword: '',
  inte_region_id: '',
  inte_currency_id: '',
});
const data = reactive({
  activeName: 'account',
  accountForm: {
    username: '',
    password: '',
    repassword: '',
    inte_region_id: null,
    inte_currency_id: null,
    mobile: '',
    email: '',
    id: window.sessionStorage.getItem('agentCode') || '',
    phone_area_code: '86',
  },
  accountRules: {
    username: [
      { required: true, message: global.$t(`账号由6-12位英文字母或数字组成`), trigger: 'blur' },
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const reg = /^[A-Za-z][0-9A-Za-z]{5,11}/;
          if (!reg.test(value)) {
            callback(new Error(global.$t('账号由6-12位英文字母或数字组成')));
          }
          callback();
        },
      },
    ],
    mobile: [
      { required: true, message: global.$t(`请填写手机号`), trigger: 'blur' },
    ],
    email: [
      { required: true, message: global.$t(`请填写邮箱`), trigger: 'blur' },
    ],
    password: [
      {
        required: true,
        message: global.$t(`密码由6-20位英文字母,数字,符号组成`),
        trigger: 'blur',
      },
      {
        trigger: 'blur',
        validator: (rule, value, callback) => {
          const reg = /^(?=.*\d)(?=.*[A-Za-z])[\x20-\x7e]{6,20}$/;
          if (!reg.test(value)) {
            callback(new Error(global.$t('密码由6-20位英文字母,数字,符号组成')));
          }
          callback();
        },
      },
    ],
    repassword: [
      {
        trigger: 'blur',
        validator: pwdCheck,
      },
    ],
    inte_region_id: [
      { required: true, message: global.$t(`请选择地区`), trigger: 'change' },
    ],
    inte_currency_id: [
      { required: true, message: global.$t(`请选择货币类型`), trigger: 'change' },
    ],
  },
  mobileForm: {
    mobile: null,
    code: null,
    phone_area_code: '86',
    id: window.sessionStorage.getItem('agentCode') || '',
    inte_region_id: null,
    inte_currency_id: null,
  },
  mobileRules: {
    mobile: [
      { required: true, message: global.$t(`请输入手机号`), trigger: 'blur' },
    ],
    code: [
      { required: true, message: global.$t(`请输入验证码`), trigger: 'blur' },
    ],
    inte_region_id: [
      { required: true, message: global.$t(`请选择地区`), trigger: 'change' },
    ],
    inte_currency_id: [
      { required: true, message: global.$t(`请选择货币类型`), trigger: 'change' },
    ],
  },
  phoneCode: '+86',
  isTermsShow: false,
});
const accountRecShow = ref(false);
const mobileRecShow = ref(false);
function pwdCheck(rule, value, callback) {
  if (value === '') {
    callback(new Error(global.$t('请再次输入密码')));
  } else if (value !== data.accountForm.password) {
    callback(new Error(global.$t('两次输入密码不一致!')));
  } else {
    callback();
  }
}
const accountForm = ref(null);
const mobileForm = ref(null);

const registerType = ref(1);

const { app } = $store.state;

watch(() => user.isLogin, async (isLogin) => {
  if (!isLogin) {
    // 如果浏览器语言与ip返回的语言一致，就直接填入默认对应的地区货币数据
    let res = await spreadcodecurrency({
      domain: location.host,
    });

    if (typeof res?.inte_currency_id !== 'undefined') {
      confirmCurrency(res);
      const areaCode = await getAreaCodeFromRegion($store, res.inte_region_id);
      data.accountForm.phone_area_code = areaCode;
      data.mobileForm.phone_area_code = areaCode;
      return;
    }

    const agentCode = sessionStorage.getItem('agentCode');

    if (agentCode) {
      res = await spreadcodecurrency({
        code: agentCode,
      });
      if (typeof res?.inte_currency_id !== 'undefined') {
        confirmCurrency(res);
        const areaCode = await getAreaCodeFromRegion($store, res.inte_region_id);
        data.accountForm.phone_area_code = areaCode;
        data.mobileForm.phone_area_code = areaCode;
        return;
      }
    }

    if (app.isLangMatching) {
      confirmCurrency({
        inte_region_id: app.regionId,
        inte_currency_id: app.currencyId,
      });
      data.accountForm.phone_area_code = app.langMatchingAreaCode;
      data.mobileForm.phone_area_code = app.langMatchingAreaCode;
    } else {
      currencyShow.value = true;
      const phoneareav3 = app.dicts.phoneareav3;
      data.accountForm.phone_area_code = phoneareav3[0].split('-')[2];
      data.mobileForm.phone_area_code = phoneareav3[0].split('-')[2];
    }
  }
}, { immediate: true });

useRequest(() => siteinfo(data.accountForm ? data.accountForm : {}), {
  manual: false,
  onSuccess(res) {
    registerType.value = Number(res?.pc_register_setting?.username_register ?? 1);
  },
});

const phoneareav3 = computed(() => dicts?.phoneareav3 ?? []);

// 处理页面刷新，因时效性问题报错
// 注释之后未发现有报错的情况，暂时注释，解决白屏问题
// const loaded = ref(false);
// watchEffect(() => {
//   if (phoneareav3.value.length > 0) {
//     loaded.value = true;
//   }
// });

// 切换注册方式
function handlerTab(index) {
  tab.activeKey = index;
  data.activeName = index === 1 ? 'mobile' : 'account';
}

// 获取验证码
const num = ref(60);
const { run: runInterval, stop: stopInterval, running } = useInterval(() => {
  num.value -= 1;
  if (num.value === 0) {
    stopInterval();
    num.value = 60;
  }
}, 1000, { manual: true });

const { run: smsRun, loading: smsLoading } = useRequest(() => smscode(data?.mobileForm), {
  manual: true,
  onSuccess: () => {
    runInterval();
  },
});
// 发送验证码
function handlerCode() {
  smsRun();
}
// 提交
const config = {
  mobile: mobileForm,
  account: accountForm,
};

function handlerSubmit() {
  if (user.registerLoading) return;
  console.log(data.accountForm);
  config[data.activeName].value.validate(async (valid) => {
    if (valid) {
      let result = null;
      data.mobileForm.id = data.mobileForm.id ? data.mobileForm.id : sessionStorage.getItem('agentCode');
      data.accountForm.id = data.accountForm.id ? data.accountForm.id : sessionStorage.getItem('agentCode');
      if (tab.activeKey === 1) {
        result = await $store.dispatch('user/register', { name: data.activeName, data: { ...(data.activeName === 'mobile' ? data.mobileForm : data.accountForm) } });
      } else if (registerType.value === 1) {
        result = await $store.dispatch('user/register', { name: data.activeName, data: { ...(data.activeName === 'mobile' ? data.mobileForm : data.accountForm) } });
      } else {
        global.$dialog({
          tpl: 'BindMobile',
          registerType: registerType.value,
          accountData: {
            name: data.activeName,
            data: { ...data.accountForm },
          },
        });
      }
      if (result) {
        global.$router.push({ name: 'registerSuccess' });
      }
    }
  });
}
function showTerms() {
  data.isTermsShow = true;
}

function confirmCurrency(res) {
  data.accountForm.inte_region_id = res.inte_region_id;
  data.accountForm.inte_currency_id = res.inte_currency_id;
  data.mobileForm.inte_region_id = res.inte_region_id;
  data.mobileForm.inte_currency_id = res.inte_currency_id;
  registerType.value = res.registerType;
  currencyShow.value = false;
}

</script>

<style lang="scss" scoped>
.register-box {
  min-height: calc(100vh - 167px);
  padding: 30px 0 49px;
  background: var(--dark-theme-color, #f5f9f9) url('@/assets/images/register/bg@3x.jpg') center center no-repeat;
  background-size: 100% 100%;

  p {
    margin: 0;
  }

  .register-wrap {
    padding-bottom: 30px;
    width: 1200px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    background-color: var(--dark-bg-color-232323, var(--bg-color-fff));
    margin: 0 auto;
    &-title {
      background: #25c39a;
      padding: 17px 0;
      font-size: 30px;
      font-family: SourceHanSansCN, SourceHanSansCN-Normal;
      font-weight: Normal;
      text-align: center;
      color: #ffffff;
      line-height: 30px;
    }
    &-content {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding-top: 42px;
      &-left {
        width: 363px;
        background-size: 100% auto;

        > img {
          display: block;
          width: 244px;
          margin: 0 auto;
        }

        > div {
          width: 349px;
          background: var(--bg-color-fff);
          box-shadow: 0px 0px 7px 0px rgba(37, 195, 154, 0.27);
          padding: 13px 19px 23px;
          text-align: left;
          box-sizing: border-box;

          h2 {
            color: var(--theme-color);
            font-size: 20px;
            margin: 0 0 6px;
          }

          p {
            font-size: 14px;
            color: var(--font-color-333);
            line-height: 20px;
            margin: 0;

            &:last-child {
              text-align: center;
            }
          }
          img {
            width: 68px;
            margin: 20px 35px 0;
          }
        }
      }
      &-right {
        width: 539px;
        margin-left: 70px;
        &-title {
          justify-content: space-around;
          span {
            text-align: center;
            font-size: 16px;
            font-family: SourceHanSansCN, SourceHanSansCN-Normal;
            font-weight: Normal;
            color: var(--font-color-999);
            line-height: 27px;
            position: relative;
            cursor: pointer;

            &::after {
              content: '';
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
        &-form {
          width: 539px;
          margin: 0 auto;
          padding-top: 20px;
          .el-input,
          .el-select {
            width: 539px;

            :deep(.el-input__inner) {
              height: 32px;
              font-size: 14px;
            }

            :deep(.el-input__suffix) {
              line-height: 32px;
              .el-select__caret {
                line-height: 32px;
              }
            }
          }
          &-code {
            padding-top: 6px;
            text-align: right;
            cursor: pointer;
          }

          .form-getcode {
            position: relative;

            .el-button {
              position: absolute;
              right: 18px;
              top: 50%;
              transform: translateY(-50%);
              padding-top: 0;
              border: 0;
              padding: 0;
              font-size: 14px;
              height: 32px;
              min-height: 32px;
              background-color: transparent;
            }
          }
          .form-phoneselect {
            :deep(.el-input__inner) {
              padding-left: 95px;
            }

            .el-icon-plus {
              margin-left: 10px;
              color: var(--font-color-333);
            }

            .el-select {
              width: 65px;
              border: 0;

              :deep(.el-input__inner) {
                width: 100%;
                border: 0;
                padding: 0 20px 0 0;
                box-sizing: border-box;
              }
            }
          }
        }
        &-submit {
          margin: 0 auto;
          width: 539px;
          background: #25c39a;
          font-size: 14px;
          font-family: SourceHanSansCN, SourceHanSansCN-Normal;
          color: #ffffff;
          line-height: 32px;
          text-align: center;
          cursor: pointer;
        }
        &-tips {
          .el-radio {
            margin: 15px 0;
            color: var(--theme-color);
          }
          > span {
            font-size: 14px;
            font-family: SourceHanSansCN, SourceHanSansCN-Normal;
            font-weight: Normal;
            text-align: center;
            color: var(--theme-color);
            line-height: 36px;
            cursor: pointer;
            user-select: none;
            margin: 15px 0;
            position: relative;

            &::before {
              content: '';
              display: inline-block;
              vertical-align: middle;
              width: 20px;
              height: 20px;
              border: 1px solid #cccccc;
              border-radius: 50%;
              box-sizing: border-box;
              margin-right: 5px;
            }

            &::after {
              content: '';
              position: absolute;
              left: 5px;
              top: 6px;
              width: 10px;
              height: 10px;
              background: var(--theme-color);
              border-radius: 50%;
            }
          }
          p {
            font-size: 14px;
            span.green {
              color: rgba(37, 195, 154, 1);
              cursor: pointer;
            }
          }
        }
      }
    }

    .el-form {
      :deep() {
        label {
          line-height: 1;
          padding-left: 8px;

          &::before {
            content: none;
          }
        }
      }
    }
  }

  .pointer {
    cursor: pointer;
  }
}
</style>
