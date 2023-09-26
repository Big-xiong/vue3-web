<template>
  <div class="agent-login-modal">
    <Dialog :confirmText="active === 'signIn' ? $t('登录') : $t('成为代理')" v-model="modelValue" blockBtn center
      footerBtnWidth="100%" :confirmLoading="loginLoading || registerLoading" @onConfirm="bindSubmit"
      :showCancelBtn="false" v-bind="$attrs">
      <template #title>
        <el-tabs v-model="active">
          <el-tab-pane :label="$t('代理登录')" name="signIn"></el-tab-pane>
          <el-tab-pane :label="$t('代理注册')" name="register"></el-tab-pane>
        </el-tabs>
      </template>

      <Form ref="SignInRef" :columns="signInColumns" v-show="active === 'signIn'" class="agentuser-login">
        <template #userIcon>
          <!-- <img
            src="@/assets/images/agent/icon_user@2x.png"
            alt
          />-->
          <svg-icon name="icon_login_user" />
          <input type="password" hidden autocomplete="new-password" style="opacity: 0" />
        </template>
        <template #passIcon>
          <!-- <img
            src="@/assets/images/agent/icon_pass@2x.png"
            alt
          />-->
          <svg-icon name="icon_login_pass" />
        </template>
      </Form>
      <Form ref="registerRef" :columns="registerColumns" style="padding-top: 20px;" v-show="active === 'register'">
        <template #iconSlot>
          <span class="phone-area-code-plus">+</span>
          <span class="phone-area-code-line"></span>
          <input type="password" hidden autocomplete="new-password" style="opacity: 0" />
        </template>
      </Form>
      <el-radio v-model="agreement" label="1" class="agreement" v-show="active === 'register'">
        <span @click="openDetail">{{ $t('同意并接受《合作代理条款》') }}</span>
      </el-radio>
    </Dialog>
  </div>
</template>

<script setup>
import {
  reactive, ref, inject, watch, onMounted,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Cookies from 'js-cookie';
import { ElMessage } from 'element-plus';
import { login, register } from '@/api/agent';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';
import SvgIcon from '@/components/SvgIcon.vue';
import { getProtocol } from '@/utils/importFiles';
import { getParams } from '@/utils';
import { auditsetting } from '../../api/agent';
import { spreadcodecurrency } from '@/api/app';

const global = inject('global');

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  type: {
    type: [Number, String],
    default: 'signIn',
  },
});
const agreement = ref('1');
const active = ref(props.type);
const registerRef = ref(null);

const registerColumns = ref([
  {
    type: 'input',
    placeholder: global.$t('请输入代理帐号'),
    prop: 'username',
    autocomplete: 'off',
    rule: [{
      message: global.$t('请输入代理帐号'),
      required: true,
      trigger: 'blur',
    }],
  },
  {
    type: 'password',
    placeholder: global.$t('请输入密码'),
    prop: 'password',
    autocomplete: 'off',
    'show-password': true,
    rule: [{
      message: global.$t('密码由6-20位英文字母或数字组成'),
      required: true,
      trigger: 'blur',
      validator: (rule, value, callback) => {
        const reg = /^[0-9A-Za-z]{6,20}$/;
        if (!reg.test(value)) {
          callback(new Error(global.$t('密码由6-20位英文字母或数字组成')));
        }
        callback();
      },
    }],
  },
  {
    type: 'input',
    placeholder: global.$t('请输入微信号'),
    prop: 'wechat',
    autocomplete: 'off',
    rule: [{
      message: global.$t('请输入微信号'),
      required: true,
      trigger: 'blur',
    }],
  },
  {
    type: 'input',
    placeholder: global.$t('请输入Skype号'),
    prop: 'skype',
    autocomplete: 'off',
    rule: [{
      message: global.$t('请输入Skype号'),
      required: true,
      trigger: 'blur',
    }],
  },
  [
    {
      placeholder: global.$t('手机号'),
      prop: 'phone_area_code',
      type: 'select',
      list: [],
      value: 'key',
      defaultValue: '86',
      class: 'form-phone-select',
      'popper-append-to-body': false,
      'show-arrow': false,
      children_prefix: (h) => h(SvgIcon, { name: 'phone' }),
      renderOption: (item, h) => h('div', { class: 'phone-select' }, [h('span', item.value), h('span', { class: 'phone-select-code' }, item.label)]),
      slot: 'iconSlot',
      width: '110px',
    },
    {
      type: 'input',
      prop: 'mobile',
      slot: 'phoneSelect',
      class: 'form-phone-inpput',
      width: '386px',
      placeholder: global.$t('请填写您的手机号码'),
      children_prefix: (h) => h(SvgIcon, { name: 'phone' }),
      rule: [{
        required: true,
        trigger: 'blur',
        message: global.$t('请输入正确手机号'),
      }],
    },
  ],
]);

// 子库配置排除逻辑
const { agentRegisterConfig } = inject('subConfig');
if (agentRegisterConfig) {
  const { exclude } = agentRegisterConfig;
  registerColumns.value = registerColumns.value.filter(({ prop }) => !exclude.includes(prop));
}

let closeDialog = null;
const $store = inject('store');
// $store.dispatch('app/getDict', ['phoneareav3']);
const { dicts } = $store.state.app;

const { run: getAuditSetting, data: auditSetting } = useRequest((params) => auditsetting(params), {
  onSuccess(result) {
    const hasParentCode = registerColumns.value.find((item) => item.prop === 'parent_code');
    if (result.agent_code_show === 2) {
      if (!hasParentCode) {
        registerColumns.value.push({
          type: 'input',
          placeholder: global.$t('推荐码'),
          prop: 'parent_code',
          defaultValue: getParams('id') ?? '',
          autocomplete: 'off',
        });
      }
    } else if (hasParentCode) {
      registerColumns.value = registerColumns.value.filter((item) => item.prop !== 'parent_code');
    }
  },
});

function regionChange(name) {
  registerColumns.value[6].disabled = false;
  registerRef.value.data.inte_currency_id = dicts?.regionlist?.find((item) => item.id === name)?.currency_conf?.default?.id;
  registerColumns.value[6].list = dicts?.regionlist?.filter((item) => item.id === name)[0]?.currency_conf?.list?.filter((child) => child.status === 1);
  if (registerRef.value.data.inte_currency_id) {
    getAuditSetting({
      ...registerRef.value.data,
    });
  }
}

const isNeedCurrency = ref(true);
const spreadCodeData = ref(null);

onMounted(async () => {
  let result = await spreadcodecurrency({
    domain: location.host,
  });

  if (typeof result?.inte_currency_id !== 'undefined') {
    isNeedCurrency.value = false;
    spreadCodeData.value = result;
    getAuditSetting(result);
    registerColumns.value.splice(registerColumns.value.length - 2, 2);
  } else if (getParams('id')) {
    result = await spreadcodecurrency({ code: getParams('id') });
    if (typeof result.inte_currency_id !== 'undefined') {
      spreadCodeData.value = result;
      isNeedCurrency.value = false;
      getAuditSetting(result);
      registerColumns.value.splice(registerColumns.value.length - 2, 2);
    }
  }

  $store.dispatch('app/getDict', 'phoneareav3').then((res) => {
    if (spreadCodeData.value?.phone_area_code) {
      registerRef.value.data.phone_area_code = spreadCodeData.value.phone_area_code;
    } else {
      registerRef.value.data.phone_area_code = res[0].split('-')[2];
    }
  });
});

watch(() => dicts.phoneareav3, () => {
  registerColumns.value[4][0].list = dicts.phoneareav3?.map((item) => ({
    key: item.split('-')[2], label: item.split('-')[2], value: item.split('-')[1],
  }));
}, { immediate: true });

const { run: postLogin, loading: loginLoading } = useRequest(
  (params) => login(params),
  {
    manual: true,
    async onSuccess(loginResult) {
      Cookies.set('agent_access_token', loginResult.access_token);
      await $store.dispatch('agent/getUserInfo');
      global.$router.push({ path: '/affiliate/home', replace: true });
      closeDialog();
    },
  },
);

const { run: postRegister, loading: registerLoding } = useRequest(
  (params) => register({ ...params, register_domain: document.domain, id: registerRef.value.data.parent_code || getParams('id') }),
  {
    manual: true,
    async onSuccess() {
      if (auditSetting.value?.agent_audit === 1) {
        global.$message.success(global.$t('登陆成功！'));
        await postLogin(registerRef.value.data);
      } else {
        global.$message.success(global.$t('成功提交审核'));
        closeDialog();
      }
    },
  },
);

function doRegister() {
  registerRef.value.form.validate((valid) => {
    if (valid) {
      if (agreement.value === '0') {
        ElMessage.error(global.$t('请选择同意并接受《合作代理条款》'));
        return;
      }

      const params = { ...registerRef.value.data };
      if (spreadCodeData.value) {
        params.inte_region_id = spreadCodeData.value.inte_region_id;
        params.inte_currency_id = spreadCodeData.value.inte_currency_id;
      }

      postRegister(params);
    }
  });
}

const signInColumns = reactive([
  {
    type: 'input',
    placeholder: global.$t('请输入代理帐号'),
    prop: 'username',
    slot: 'userIcon',
    rule: [{
      message: global.$t('请输入代理帐号'),
      required: true,
      trigger: 'blur',
    }],
  },
  {
    type: 'password',
    placeholder: global.$t('请输入密码'),
    slot: 'passIcon',
    prop: 'password',
    'show-password': true,
    rule: [{
      message: global.$t('请输入密码'),
      required: true,
      trigger: 'blur',
    }],
  },
]);

const SignInRef = ref(null);
function doLogin() {
  SignInRef.value.form.validate((valid) => {
    if (valid) {
      postLogin(SignInRef.value.data);
    }
  });
}

function bindSubmit(close) {
  closeDialog = close;
  if (active.value === 'signIn') {
    doLogin();
  } else {
    doRegister();
  }
}

const { data: adData, run: detailRun, loading: adLoading } = useRequest(getProtocol, {
  manual: true,
});

async function openDetail() {
  adData.value = await detailRun({ CACHE: true, id: 1 });
  global.$dialog({
    tpl: 'DiscountDetail', title: global.$t('合作代理条款'), name: '', content: adData.value.replaceAll('\n', '<p></p>'),
  });
}
</script>

<style lang="scss" scoped>
.agent-login-modal {
  :deep(.el-dialog__footer) {
    padding: 0 57px 53px;
  }

  :deep(.el-dialog__body-wrap) {
    padding: 0 57px !important;
  }

  :deep(.el-tabs__item) {
    padding: 20px 0 20px 60px !important;
    font-size: 20px;
    color: var(--font-color-0a0a0a);
    height: 85px;

    &.is-active {
      color: var(--font-color-000);
    }
  }

  :deep(.el-input-group__prepend),
  :deep(.el-input__inner),
  :deep(.el-input-group) {
    border-color: transparent;
    background-color: var(--bg-color-ececec);
  }

  :deep(.el-input__inner) {
    height: 50px !important;
  }

  :deep(.el-select) {
    background-color: transparent;
  }
}

:deep(.icon-phone) {
  width: 18px;
  height: 32px;
}

.phone-form {
  .area-wrap {
    display: flex;
    position: absolute;
    align-items: center;
    width: 110px;
    left: 10px;
    z-index: 1;

    i,
    span,
    div {
      color: var(--font-color-525152);
    }

    i {
      margin-right: 5px;
      font-size: 20px;
    }

    .span {
      color: var(--font-color-8f8f8f);
    }

    .line {
      top: 15px;
      right: 0;
      z-index: 10;
      width: 1px;
      position: absolute;
      height: 16px;
      background-color: #525152;
    }
  }

  :deep(.el-select__caret) {
    font-size: 22px;
    color: var(--font-color-666);
  }

  :deep(.el-select) {
    width: 120px;
    box-sizing: border-box;
    padding-left: 38px !important;

    input {
      font-size: 16px;
    }
  }
}

// :deep(.el-input__inner) {
//   padding-left: 36px;
// }

:deep(.el-input__prefix) {
  line-height: 47px;
}

:deep(.el-input__icon) {
  line-height: 50px !important;
}

:deep(.config-form-wrap-group) {
  position: relative;

  .el-form-item {
    max-width: initial;

    &:first-child {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 1;
    }
  }

  .form-phone-inpput {
    .el-input__inner {
      padding-left: 120px;
    }
  }

  .el-select {
    margin: 1px 0 0 1px;

    .el-input__inner {
      background-color: transparent !important;
      padding-left: 40px;
      border: 0;
      line-height: 48px;
      height: 48px !important;
    }

    .el-input__suffix {
      line-height: 50px;
    }
  }
}

> :deep(.el-form-item) {
  .el-form-item__content {
    display: flex;
    align-items: center;
  }
}

.phone-area-code-plus {
  position: absolute;
  left: 30px;
  top: 0;
  line-height: 48px;
  font-size: 16px;
  color: var(--font-color-333);
}

.phone-area-code-line {
  width: 1px;
  position: absolute;
  height: 20px;
  background: var(--border-color-000-1);
  top: 50%;
  transform: translateY(-50%);
  right: 0;
}

.agreement {
  width: 100%;
  text-align: center;
}

.agentuser-login {
  padding-top: 20px;

  .svg-icon {
    position: absolute;
    left: 15px;
    width: 22px;
    height: 22px;
    fill: var(--fill-color-43535D) !important;
  }

  :deep(.el-input__inner) {
    padding-left: 50px;
  }
}

:deep(.icon-phone) {
  fill: var(--font-color-333);
}
</style>
