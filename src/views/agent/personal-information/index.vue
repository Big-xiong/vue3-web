<template>
  <div class="personal-information-wrap">
    <Form ref="accountRef" label-position="top" :columns="accountColumns">
      <template #rightSlot>
        <span class="el-select-prefix el-icon-plus"></span>
        <el-input class="form-phone-input" v-model="tel" :disabled="isMobileValid" :placeholder="$t('请输入手机号')"> </el-input>

        <template v-if="isMobileValid">
          <el-tag size="mini" type="success" effect="dark" v-if="agent.userInfo?.mobile">{{ $t('已验证') }}</el-tag>
          <el-button @click="changeMobile(true)">{{ $t('修改') }}</el-button>
        </template>
        <template v-else>
          <el-tag size="mini" type="danger" effect="dark" v-if="agent.userInfo?.mobile">{{ $t('未验证') }}</el-tag>
        </template>

        <el-button
          @click="getCode('mobile')"
          :loading="smsLoading"
          :disabled="running"
          v-if="isChangingMobile || agent.userInfo?.is_valid_mobile === 1"
          >{{ $t(`获取验证码`) }}{{ num === 60 ? '' : `(${num})` }}</el-button
        >

        <div class="form-phone-code" v-if="isShowCodeInput">
          <el-input v-model="mobileCode" class="form-phone-input" :placeholder="$t('请输入验证码')"></el-input>
          <el-button @click="bindingCode('mobile')" :disabled="!mobileCode" :loading="bindLoading">{{ $t('绑定') }} </el-button>
        </div>
      </template>
    </Form>
    <el-button class="save-btn" @click="saveProfile" :loading="saveLoading" type="primary">{{ $t(`保存`) }}</el-button>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import Form from '@/components/Form/index.vue';
import { useInterval } from '@/utils/hooks';
import { updatedetail, bindsmscode, bindmobile } from '@/api/agent';

const subConfig = inject('subConfig');

const accountRef = ref(null);
const tel = ref('');
const mobileCode = ref('');
const global = inject('global');
const $store = inject('store');
const { agent } = $store.state;
const isChangingMobile = ref(false);
const isShowCodeInput = ref(false);

const isMobileValid = computed(() => !isChangingMobile.value && agent.userInfo?.is_valid_mobile === 2);

const accountColumns = ref([
  {
    label: global.$t('真实姓名'),
    type: 'input',
    prop: 'realname',
    width: '500px',
    disabled: true,
    placeholder: global.$t('请输入真实姓名')
  },
  {
    label: global.$t('手机号'),
    placeholder: global.$t('手机号'),
    prop: 'phone_area_code',
    type: 'select',
    list: [],
    value: 'key',
    class: 'form-phone-select',
    'popper-append-to-body': false,
    'show-arrow': false,
    prefix: 'el-icon-plus',
    disabled: agent.userInfo?.is_valid_mobile === 2,
    renderOption: (item, h) =>
      h('div', { class: 'phone-select' }, [h('span', item.value), h('span', { class: 'phone-select-code' }, item.label)]),
    slot: 'rightSlot'
  },
  {
    label: global.$t('邮箱地址'),
    type: 'input',
    prop: 'email',
    width: '500px',
    placeholder: global.$t('请输入邮箱地址'),
    rule: [
      {
        validator: (rule, value, callback) => {
          const msg = global.$t('请输入的邮箱地址');
          const re =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (re.test(value)) {
            callback();
          } else {
            callback(new Error(msg));
          }
        },
        trigger: 'blur'
      }
    ]
  },
  {
    label: 'Facebook',
    type: 'input',
    prop: 'facebook',
    width: '500px',
    placeholder: global.$t('请输入Facebook')
  },
  {
    label: subConfig.isCurrency ? 'WhatsApp' : global.$t('微信号'),
    type: 'input',
    prop: 'whatsapp',
    width: '500px',
    placeholder: global.$t(subConfig.isCurrency ? '请输入WhatsApp' : `为了能够更好地体验{0}请绑定您的微信号`, [subConfig.title])
  },
  {
    label: 'Skype',
    type: 'input',
    prop: 'skype',
    width: '500px',
    placeholder: global.$t('请输入Skype')
  },
  {
    disabled: true,
    label: global.$t('地区'),
    type: 'input',
    prop: 'region_name',
    width: '500px',
    placeholder: global.$t('请输入地区')
  },
  {
    disabled: true,
    label: global.$t('货币'),
    type: 'input',
    prop: 'currency_name',
    width: '500px',
    placeholder: global.$t('请输入货币')
  }
]);

$store.dispatch('app/getDict', ['phoneareav3']);
const { dicts } = $store.state.app;
watch(
  () => dicts.phoneareav3,
  () => {
    accountColumns.value[1].list = dicts.phoneareav3?.map((item) => ({
      key: item.split('-')[2],
      label: item.split('-')[2],
      value: item.split('-')[1]
    }));
  },
  { immediate: true }
);

watch(
  () => agent.userInfo,
  (info) => {
    if (accountColumns.value[2].label === 'Facebook') {
      let item;
      if (info.region?.id === 2) {
        item = {
          label: global.$t('Line'),
          type: 'input',
          prop: 'line',
          width: '500px',
          placeholder: global.$t('请输入Line')
        };
      } else if (info.region?.id === 3) {
        item = {
          label: global.$t('Zalo'),
          type: 'input',
          prop: 'zalo',
          width: '500px',
          placeholder: global.$t('请输入Zalo')
        };
        if (item) accountColumns.value.splice(2, 0, item);
      }
    }
    initData();
  },
  { immediate: false }
);

function changeMobile(action) {
  isChangingMobile.value = action;
}

// form赋值
onMounted(() => {
  if (!subConfig.isCurrency) {
    accountColumns.value = accountColumns.value.filter(
      (item) => !['region_name', 'currency_name', 'facebook'].includes(item.prop)
    );
  }
  if (Object.keys(agent.userInfo).length) {
    initData();
  }
});

const inteContact = ref(null);

function initData() {
  const {
    realname = '',
    skype = '',
    wechat = '',
    mobile = '',
    email = '',
    phone_area_code = '',
    is_valid_mobile = '',
    currency = {},
    region = {}
  } = agent?.userInfo;
  if (agent?.userInfo?.inte_contact) {
    inteContact.value = JSON.parse(agent?.userInfo?.inte_contact);
  }

  accountColumns.value[0].disabled = !!realname;
  accountColumns.value[1].disabled = is_valid_mobile === 2;

  if (accountRef?.value) {
    tel.value = mobile;
    if (accountRef.value.data) {
      accountRef.value.data.realname = realname;
      accountRef.value.data.line = inteContact.value?.line?.account ?? '';
      accountRef.value.data.facebook = inteContact.value?.facebook?.account ?? '';
      accountRef.value.data.whatsapp = inteContact.value?.whatsapp?.account ?? '';
      accountRef.value.data.skype = inteContact.value?.skype?.account ?? '';
      accountRef.value.data.zalo = inteContact.value?.zalo?.account ?? '';
      accountRef.value.data.mobile = mobile;
      accountRef.value.data.email = email;
      accountRef.value.data.phone_area_code = phone_area_code || '86';
      accountRef.value.data.region_name = region.name;
      accountRef.value.data.currency_name = currency.name;
    }
  }
}

// 获取验证码
const num = ref(60);
const {
  run: runInterval,
  stop: stopInterval,
  running
} = useInterval(
  () => {
    num.value -= 1;
    if (num.value === 0) {
      stopInterval();
      num.value = 60;
    }
  },
  1000,
  { manual: true }
);
const { run: smsRun, loading: smsLoading } = useRequest(
  () =>
    bindsmscode({
      mobile: tel.value,
      phone_area_code: accountRef.value?.data?.phone_area_code || '+86'
    }),
  {
    manual: true,
    onSuccess: () => {
      runInterval();
      isShowCodeInput.value = true;
    }
  }
);

function getCode(name) {
  if (name === 'mobile') {
    smsRun();
  }
}

// 绑定手机号
const { run: bindRun, loading: bindLoading } = useRequest(
  () =>
    bindmobile({
      mobile: tel.value,
      phone_area_code: accountRef.value?.data?.phone_area_code || '+86',
      code: mobileCode.value
    }),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('手机号绑定成功!'));
      $store.dispatch('agent/getUserInfo');
      isChangingMobile.value = false;
      isShowCodeInput.value = false;
      stopInterval();
      num.value = 60;
    }
  }
);

function bindingCode(name) {
  const { mobile, phone_area_code } = accountRef.value.data;

  if (name === 'mobile') {
    bindRun({ mobile, phone_area_code, code: mobileCode.value });
  }
}

// 保存
const { run: saveRun, loading: saveLoading } = useRequest((params) => updatedetail(params), {
  manual: true,
  onSuccess: () => {
    global.$message.success(global.$t('信息保存成功！'));
    global.$store.dispatch('agent/getUserInfo');
  }
});

function saveProfile() {
  accountRef.value.form.validate((valid) => {
    if (valid) {
      accountRef.value.data.mobile = tel.value;
      const params = accountRef.value.data;
      const contact = {
        line: {
          account: accountRef.value.data.line,
          is_bind: inteContact.value?.line?.is_bind ?? 2
        },
        zalo: {
          account: accountRef.value.data.zalo,
          is_bind: inteContact.value?.zalo?.is_bind ?? 2
        },
        whatsapp: {
          account: accountRef.value.data.whatsapp,
          is_bind: inteContact.value?.whatsapp?.is_bind ?? 2
        },
        skype: {
          account: accountRef.value.data.skype,
          is_bind: inteContact.value?.skype?.is_bind ?? 2
        },
        facebook: {
          account: accountRef.value.data.facebook,
          is_bind: inteContact.value?.facebook?.is_bind ?? 2
        }
      };
      delete params.line;
      delete params.zalo;
      delete params.whatsapp;
      delete params.skype;
      delete params.facebook;
      params.inte_contact = JSON.stringify(contact);
      saveRun(accountRef.value.data);
    } else {
      return false;
    }
  });
}
</script>

<style lang="scss" scoped>
.personal-information-wrap {
  margin-top: auto;
  font-size: 14px;
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px;
  margin-top: 20px;
  text-align: left;

  .el-form {
    .el-select-prefix {
      position: absolute;
      left: 10px;
      top: 16px;
      color: var(--font-color-ccc);
    }

    :deep(.el-form-item__label)::before {
      content: none;
    }

    :deep(.select-trigger) input {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
    }

    :deep(.form-phone-input) input {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }

    .el-button {
      margin-left: 10px;
    }

    .form-phone-code {
      margin-top: 15px;

      :deep(.el-input__inner) {
        border-radius: 4px !important;
      }
    }

    :deep(.form-phone-select) {
      width: 110px;

      .el-input__inner {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        padding-left: 25px;
      }

      .el-select__popper {
        min-width: 380px;
        top: 45px !important;

        .el-popper__arrow {
          display: none;
        }

        .phone-select {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--font-color-ccc);

          &-code {
            color: var(--font-color-8492a6);
          }
        }
      }
    }

    .form-phone-input {
      width: 390px;

      :deep(.el-input__inner) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }

    .el-tag {
      border-radius: 20px;
      position: absolute;
      left: 430px;
      top: 13px;
      color: var(--font-color-222);
    }
  }
}

:deep(.save-btn) {
  width: 300px;
}
</style>
