<template>
  <Dialog
    :title="title"
    v-model="user.bindMobile"
    center
    :confirmText="$t('立即提交')"
    :cancelText="$t('暂不绑定')"
    @onConfirm="save"
    @onClose="onClose"
    :confirmLoading="saveLoading"
    customeClass="bindMobile-wrap"
    contentPadding="20px 40px 0"
    :serviceType="1"
    blockBtn
    @close="onClose"
  >
    <p class="dialog-form-tips">{{ $t('为了保障你的资金安全，请绑定手机号') }}</p>
    <Form ref="mobileRef" label-position="top" :columns="mobileColumns" class="select-form">
      <template #iconSlot>
        <span class="phone-area-code-plus">+</span>
        <span class="phone-area-code-line"></span>
      </template>
      <template #codeSlot>
        <el-button
          type="primary"
          @click="getCode('mobile')"
          class="code-btn"
          :loading="smsLoading"
          :disabled="btnDisable"
        >{{ $t(`获取验证码`) }}{{ num === 60 ? '' : `(${num})` }}</el-button>
      </template>
    </Form>
  </Dialog>
</template>

<script setup>
import {
  inject, reactive, ref, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { useInterval } from '@/utils/hooks';
import {
  smscode, setemail, bindmobile, bindemail,
} from '@/api/center';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
$store.dispatch('app/getDict', ['phoneareav3']);
const { dicts } = $store.state.app;
const mobileRef = ref(null);
const btnDisable = ref(false);
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});

const mobileColumns = reactive([
  [
    {
      placeholder: global.$t('手机号'),
      prop: 'phone_area_code',
      type: 'select',
      list: [],
      value: 'key',
      defaultValue: user?.userInfo?.phone_area_code ? user.userInfo.phone_area_code : '86',
      class: 'form-phone-select',
      'popper-append-to-body': false,
      'show-arrow': false,
      prefix: 'el-icon-plus',
      renderOption: (item, h) => h('div', { class: 'phone-select' }, [h('span', item.value), h('span', { class: 'phone-select-code' }, item.label)]),
      slot: 'iconSlot',
      width: '90px',
    },
    {
      type: 'input',
      prop: 'mobile',
      slot: 'phoneSelect',
      class: 'form-phone-inpput',
      defaultValue: user?.userInfo.mobile,
      // children_prefix: (h) => h(SvgIcon, { name: 'phone' }),
      placeholder: global.$t('请输入电话号码'),
      rule: [{
        required: true,
        trigger: 'blur',
        message: global.$t('请输入正确手机号'),
      }],
    },
  ],
  {
    type: 'input',
    prop: 'code',
    placeholder: global.$t('请输入验证码'),
    slot: 'codeSlot',
    // children_prefix: (h) => h(SvgIcon, { name: 'phone' }),
    rule: [{
      required: true,
      trigger: 'blur',
      message: global.$t('请输入验证码'),
    }],
  },
]);

watch(() => dicts.phoneareav3, () => {
  mobileColumns[0][0].list = dicts.phoneareav3?.map((item) => ({
    key: item.split('-')[2], label: item.split('-')[2], value: item.split('-')[1],
  }));
}, { immediate: true });
// 获取验证码
const num = ref(60);
const { run: runInterval, stop: stopInterval } = useInterval(() => {
  num.value -= 1;
  if (num.value === 0) {
    stopInterval();
    num.value = 60;
    btnDisable.value = false;
  }
}, 1000, { manual: true });

const { run: smsRun, loading: smsLoading } = useRequest(() => smscode(mobileRef?.value?.data), {
  manual: true,
  onSuccess: () => {
    runInterval();
  },
});

const emailnNum = ref(60);
const { run: runEmailInterval, stop: stopEmailInterval } = useInterval(() => {
  emailnNum.value -= 1;
  if (emailnNum.value === 0) {
    stopEmailInterval();
    emailnNum.value = 60;
  }
}, 1000, { manual: true });

const { run: emailRun, loading: emailLoading } = useRequest(() => setemail(mobileRef?.value?.data), {
  manual: true,
  onSuccess: () => {
    runEmailInterval();
  },
});

function getCode(name) {
  if (name === 'mobile') {
    if (!mobileRef?.value?.data.mobile) {
      global.$message.error(global.$t('请输入电话号码'));
      return;
    }
    smsRun();
  } else if (name === 'email') {
    // console.log(mobileRef?.value?.data);
    emailRun();
  }
  btnDisable.value = true;
}

// 保存
// 绑定手机号
const { run: bindRun, loading: saveLoading } = useRequest(bindmobile, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('手机号绑定成功!'));
    $store.dispatch('user/getUserInfo');
  },
});

// 绑定邮箱
const { run: bindEmailRun, loading: bindEmailLoading } = useRequest(bindemail, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('邮箱绑定成功!'));
    $store.dispatch('user/getUserInfo');
  },
});

const emit = defineEmits(['onClose', 'onConfirm']);

function save(close) {
  mobileRef.value.form.validate((valid) => {
    if (valid) {
      bindRun(mobileRef.value.data);
      emit('onConfirm', false);
      close();
    } else {
      return false;
    }
  });
}

function onClose(close) {
  emit('onClose', false);
  close();
}
</script>

<style lang="scss" scoped>
.bindMobile-wrap {
  text-align: center;

  .icon {
    color: var(--font-color-f66);
    font-size: 70px;
    text-align: center;
    margin-top: 30px;
  }

  .title {
    color: var(--font-color-f66);
    font-size: 20px;
    font-weight: 500;
    text-align: center;
    margin: 30px 0 20px;
  }

  .tips {
    text-align: center;
    font-size: 16px;
    color: var(--font-color-ccc);
    margin: 0;
  }

  .code-btn {
    margin-left: 20px;
  }

  .form-phone-code {
    margin-top: 15px;

    :deep(.el-input__inner) {
      border-radius: 4px !important;
    }
  }

  :deep(.dialog-footer-inline-btn) {
    flex-direction: row-reverse;
  }
}

.select-form {
  // :deep(.el-input__inner) {
  //   padding-left: 36px;
  // }

  :deep(.svg-icon) {
    width: 17px;
    height: 20px;
    color: var(--font-color-525152);
    margin-left: 5px;
  }

  :deep(.el-input__prefix) {
    line-height: 45px;
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
        padding-left: 100px;
      }
    }

    .el-select {
      .el-input__inner {
        background-color: transparent;
        padding-left: 30px;
        border: 0;
        padding-right: 0;
      }

      .el-input__suffix {
        line-height: 45px;
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
    left: 20px;
    top: 0;
    font-size: 16px;
    color: var(--font-color-000);
    line-height: 43px;
  }

  .phone-area-code-line {
    width: 1px;
    position: absolute;
    height: 20px;
    background: var(--border-color-000-1);
    top: 12px;
    right: 0;
  }
}
</style>
