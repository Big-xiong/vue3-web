<template>
  <div class="personal-information-wrap asdf">
    <Form ref="accountRef" label-position="top" :columns="accountColumns">
      <template #rightSlot>
        <span class="el-select-prefix el-icon-plus"></span>
        <el-input class="form-phone-input" v-model="tel" :disabled="isMobileValid" :placeholder="$t('请输入手机号')">
        </el-input>
        <el-tag size="mini" :type="isMobileValid ? 'success' : 'danger'" effect="dark" v-if="agent.userInfo?.mobile" v-lang:en="'left:400px'">{{
            isMobileValid ? $t('已验证') : $t('未验证')
        }}</el-tag>
        <el-button @click="getCode('mobile')" :loading="smsLoading" :disabled="running" v-if="isChangingMobile">{{
            $t(`获取验证码`)
        }}{{ num === 60 ? '' : `(${num})` }}</el-button>
        <el-button v-else-if="!isChangingMobile">{{ $t('修改') }}</el-button>
        <div class="form-phone-code" v-if="isChangingMobile">
          <el-input v-model="mobileCode" class="form-phone-input" :placeholder="$t('请输入验证码')"></el-input>
          <el-button @click="bindingCode('mobile')" :disabled="!mobileCode" :loading="bindLoading">{{ $t('绑定') }}
          </el-button>
        </div>
      </template>
    </Form>
    <el-button class="save-btn" @click="saveProfile" :loading="saveLoading" type="primary">{{ $t(`保存`) }}</el-button>
  </div>
</template>
<script setup>
import {
  ref, inject, reactive, watch, onMounted, computed,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Form from '@/components/Form/index.vue';
import { useInterval } from '@/utils/hooks';
import {
  updatedetail, bindsmscode, bindmobile,
} from '@/api/agent';

const subConfig = inject('subConfig');
const accountRef = ref(null);
const tel = ref('');
const mobileCode = ref('');
const global = inject('global');
const $store = inject('store');
const { agent } = $store.state;
const isChangingMobile = ref(true);
const isMobileValid = computed(() => !isChangingMobile.value && agent.userInfo?.is_valid_mobile === 2);
const accountColumns = reactive([
  {
    label: global.$t('真实姓名'),
    type: 'input',
    prop: 'realname',
    width: '500px',
    disabled: true,
    placeholder: global.$t('请输入真实姓名'),
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
    disabled: false,
    renderOption: (item, h) => h('div', { class: 'phone-select' }, [h('span', item.value), h('span', { class: 'phone-select-code' }, item.label)]),
    slot: 'rightSlot',
  },
  {
    label: global.$t('邮箱地址'),
    type: 'input',
    prop: 'email',
    width: '500px',
    placeholder: global.$t('请输入邮箱地址'),
    rule: [{
      validator: (rule, value, callback) => {
        const msg = global.$t('请输入的邮箱地址');
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(value)) {
          callback();
        } else {
          callback(new Error(msg));
        }
      },
      trigger: 'blur',
    }],
  },
  {
    label: $t('微信号'),
    type: 'input',
    prop: 'wechat',
    width: '500px',
    placeholder: global.$t(`为了能够更好地体验{0}请绑定您的微信号`, [subConfig.title]),
  },
  {
    label: 'Skype',
    type: 'input',
    prop: 'skype',
    width: '500px',
    placeholder: global.$t('请输入Skype'),
  },
]);
$store.dispatch('app/getDict', ['phoneareav3']);
const { dicts } = $store.state.app;
watch(() => dicts.phoneareav3, () => {
  accountColumns[1].list = dicts.phoneareav3?.map((item) => ({
    key: item.split('-')[2], label: item.split('-')[2], value: item.split('-')[1],
  }));
}, { immediate: true });

// form赋值
onMounted(() => {
  // initData();
  watch(() => agent.userInfo, () => {
    initData();
  }, { immediate: true });
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
    region = {},
  } = agent?.userInfo;
  if (agent?.userInfo?.inte_contact) {
    inteContact.value = JSON.parse(agent?.userInfo?.inte_contact);
  }
  accountColumns[0].disabled = !!realname;
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
      accountRef.value.data.wechat = wechat;
      accountRef.value.data.skype = skype;
      accountRef.value.data.phone_area_code = phone_area_code || '86';
      accountRef.value.data.region_name = region.name;
      accountRef.value.data.currency_name = currency.name;
    }
  }
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
const { run: smsRun, loading: smsLoading } = useRequest(
  () => bindsmscode({
    mobile: tel.value,
    phone_area_code: accountRef.value?.data?.phone_area_code || '+86',
  }),
  {
    manual: true,
    onSuccess: () => {
      runInterval();
    },
  },
);
function getCode(name) {
  if (name === 'mobile') {
    smsRun();
  }
}
// 绑定手机号
const { run: bindRun, loading: bindLoading } = useRequest(
  () => bindmobile({
    mobile: tel.value,
    phone_area_code: accountRef.value?.data?.phone_area_code || '+86',
    code: mobileCode.value,
  }),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('手机号绑定成功!'));
      $store.dispatch('agent/getUserInfo');
      isChangingMobile.value = false;
    },
  },
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
  },
});
function saveProfile() {
  accountRef.value.form.validate((valid) => {
    if (valid) {
      accountRef.value.data.mobile = tel.value;
      const params = accountRef.value.data;
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

    .el-button {
      margin-left: 10px;
    }

    .form-phone-code {
      margin-top: 15px;

      :deep(.form-phone-input) {
        .el-input__inner {
          border-radius: 6px !important;
        }
      }
    }

    .form-phone-input {
      .el-input__inner {
        padding-left: 25px;
      }
    }

    :deep(.form-phone-select) {
      width: 95px;

      .el-input__inner {
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
          // color: var(--font-color-ccc);
          // &-code {
          //   color: var(--font-color-8492a6);
          // }
        }
      }

      &.el-select {
        .el-input__inner {
          border-top-right-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
        }
      }
    }

    .form-phone-input {
      width: 390px;

      :deep(.el-input__inner) {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
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
