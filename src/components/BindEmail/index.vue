<template>
  <Dialog
    :title="title"
    v-model="show"
    center
    :confirmText="$t('立即提交')"
    :cancelText="$t('暂不绑定')"
    @onConfirm="save"
    @onClose="onClose"
    :confirmLoading="bindEmailLoading"
    customeClass="bindMobile-wrap"
    contentPadding="20px 40px 0"
    :serviceType="1"
    blockBtn
    :show-close="false"
  >
    <i class="el-icon-close bindemail-icon" @click="closeDia"></i>
    <Form ref="emailRef" label-position="top" :columns="emailColumns" class="select-form">
      <template #codeSlot>
        <el-button
          type="primary"
          @click="emailRun"
          class="code-btn"
          :loading="emailLoading"
          :disabled="emailLoading || emailnNum !== 60"
        >{{ $t(`获取验证码`) }}{{ emailnNum === 60 ? '' : `(${emailnNum})` }}</el-button>
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
  setemail, bindemail,
} from '@/api/center';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';
import SvgIcon from '@/components/SvgIcon.vue';

const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
$store.dispatch('app/getDict', ['phoneareav3']);
const { dicts } = $store.state.app;
const emailRef = ref(null);

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  show: {
    type: Boolean,
    default: false,
  },
});

const emailColumns = reactive([
  {
    type: 'input',
    prop: 'email',
    class: 'form-phone-inpput',
    defaultValue: user.userInfo?.email ?? '',
    placeholder: global.$t('请输入邮箱号'),
    rule: [{
      required: true,
      trigger: 'blur',
      message: global.$t('请输入正确的邮箱号'),
    }],
  },
  {
    type: 'input',
    prop: 'code',
    placeholder: global.$t('请输入验证码'),
    slot: 'codeSlot',
  },
]);

// 获取验证码
const num = ref(60);
const { run: runInterval, stop: stopInterval } = useInterval(() => {
  num.value -= 1;
  if (num.value === 0) {
    stopInterval();
    num.value = 60;
  }
}, 1000, { manual: true });

const { run: smsRun, loading: smsLoading } = useRequest(() => smscode(emailRef?.value?.data), {
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

const { run: emailRun, loading: emailLoading } = useRequest(() => setemail(emailRef?.value?.data), {
  manual: true,
  onSuccess: () => {
    runEmailInterval();
  },
});

const emit = defineEmits(['onClose', 'onConfirm']);

// 绑定邮箱
const { run: bindEmailRun, loading: bindEmailLoading } = useRequest(bindemail, {
  manual: true,
  onSuccess() {
    global.$message.success(global.$t('邮箱绑定成功!'));
    emit('onConfirm', false);
    $store.dispatch('user/getUserInfo');
  },
});

function save(close) {
  emailRef.value.form.validate((valid) => {
    if (valid) {
      bindEmailRun(emailRef.value.data);
    } else {
      return false;
    }
  });
}

function onClose(close) {
  emit('onClose', false);
  close();
}

function closeDia() {
  global.$router.push({ name: 'index' });
  emit('onClose', false);
}
</script>

<style lang="scss" scoped>
.bindMobile-wrap {
  text-align: center;

  .bindemail-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;

    &:hover {
      color: var(--theme-color);
    }
  }

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
