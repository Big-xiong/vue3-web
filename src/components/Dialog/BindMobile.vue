<template>
  <Dialog v-model="modelValue" :title="$t('绑定手机')" center confirmType="primary" :confirmText="$t('确认')"
    :confirmLoading="loading" cancelType="grey" :cancelText="$t('残忍拒绝')" @onConfirm="confirmBind"
    @onClose="close => { close() }" customeClass="changepwdoraccount-wrap" titlePadding="0" contentPadding="20px 40px 0">
    <Form ref="mobileRef" label-position="top" :columns="mobileColumns" class="select-form">
      <template #iconSlot>
        <span class="phone-area-code-plus">+</span>
        <span class="phone-area-code-line"></span>
      </template>
      <template #codeSlot>
        <el-button type="primary" @click="getCode('mobile')" class="code-btn" :loading="smsLoading">
          {{ $t(`获取验证码`) }}{{ num === 60 ? '' : `(${num})` }}</el-button>
      </template>
    </Form>
  </Dialog>
</template>

<script setup>
import {
  inject, reactive, ref, watch, computed,
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

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
  registerType: {
    type: Number,
    default: 1,
  },
  callback: Function,
  accountData: {
    type: Object,
    default: () => { },
  },
});
console.log(props?.registerType);
const mobileColumns = computed(() => {
  const base = [
    [
      {
        placeholder: global.$t('手机号'),
        prop: 'phone_area_code',
        type: 'select',
        list: [],
        value: 'key',
        defaultValue: '',
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
        placeholder: global.$t('请输入电话号码'),
        rule: [{
          required: true,
          trigger: 'blur',
          message: global.$t('请输入正确手机号'),
        }],
      },
    ],
  ];
  if (props?.registerType === 4) {
    base.push({
      type: 'input',
      prop: 'code',
      placeholder: global.$t('请输入验证码'),
      slot: 'codeSlot',
    });
  }
  return base;
});

watch(() => dicts.phoneareav3, () => {
  mobileColumns.value[0][0].list = dicts.phoneareav3?.map((item) => ({
    key: item.split('-')[2], label: item.split('-')[2], value: item.split('-')[1],
  }));
  mobileColumns.value[0][0].defaultValue = mobileColumns.value[0][0].list[0].label;
}, { immediate: true });
// 获取验证码
const num = ref(60);
const { run: runInterval, stop: stopInterval } = useInterval(() => {
  num.value -= 1;
  if (num.value === 0) {
    stopInterval();
    num.value = 60;
  }
}, 1000, { manual: true });

const { run: smsRun, loading: smsLoading } = useRequest(() => smscode(mobileRef?.value?.data), {
  manual: true,
  onSuccess: () => {
    runInterval();
  },
});

function getCode(name) {
  if (name === 'mobile') {
    smsRun();
  }
}

const emit = defineEmits(['update:modelValue', 'onClose']);
function confirmBind(close) {
  // bug#19339 手机号必须为纯数字
  const reg = /^[0-9]*$/;
  if (!reg.test(mobileRef.value.data.mobile)) {
    global.$message.error(global.$t('请输入正确的手机号!'));
    return;
  }

  if (props?.registerType > 2 && !mobileRef.value.data.mobile) {
    global.$message.error(global.$t('请输入手机号!'));
    return;
  }

  if (props?.registerType === 4 && !mobileRef.value.data.code) {
    global.$message.error(global.$t('请输入验证码!'));
    return;
  }

  if (props?.accountData?.name === 'quick') {
    props.callback(mobileRef.value.data);
    close();
    return;
  }
  const dataInfo = props.accountData.data;
  dataInfo.mobile = mobileRef.value.data.mobile ? mobileRef.value.data.mobile : dataInfo.mobile;
  dataInfo.phone_area_code = mobileRef.value.data.phone_area_code ? mobileRef.value.data.phone_area_code : dataInfo.phone_area_code;
  $store.dispatch('user/register', { name: props.accountData.name, data: dataInfo }).then((res) => {
    close();
    $store.commit('user/SET_REGISTER_DIALOG', false);
    global.$router.push({ name: 'registerSuccess' });
  });

  // props.callback?.(mobileRef.value.data);
  // close();
}
</script>

<style lang="scss">
.changepwdoraccount-wrap {
  // border-radius: 6px !important;

  .el-dialog__header {
    background-color: var(--theme-color);
    border-radius: 6px 6px 0 0;
    height: 46px;

    .el-dialog-title {
      font-size: 18px;
      color: var(--font-color-fff);
      line-height: 46px;
    }

    .el-dialog__headerbtn {
      top: 15px;

      i {
        color: var(--font-color-fff);
      }
    }
  }

  .dialog-footer-inline-btn {
    flex-direction: row-reverse;
    justify-content: space-between !important;

    .el-button {
      margin: 0;
      width: 200px;
    }

    .el-button--grey {
      background-color: transparent;
      border: 1px solid var(--border-color-bbb);
      color: var(--font-color-bbb);
    }
  }

  .el-form {
    >.el-form-item {
      border-bottom: 1px solid var(--border-color-e5e5e5);
    }

    &-item {
      align-items: center;

      &.is-required {
        border-bottom: 1px solid var(--border-color-e5e5e5);
      }

      .el-input__inner {
        border: 0;
        font-size: 14px;
        background-color: transparent !important;
      }

      .code-btn {
        background: none;
        background-color: transparent;
        color: var(--theme-color);
        border: 0;
        padding-right: 0;
      }
    }
  }
}
</style>

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

      .el-select__caret{
        line-height: 40px;
      }

      .el-input__suffix {
        line-height: 40px;
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
    top: -1px;
    font-size: 16px;
    color: var(--font-color-000);
  }

  .phone-area-code-line {
    width: 1px;
    position: absolute;
    height: 20px;
    background: var(--border-color-000-1);
    top: 10px;
    right: 0;
  }
}
</style>
