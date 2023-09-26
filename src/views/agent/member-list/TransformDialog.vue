<template>
  <div class="transform-dialog-wrap">
    <Dialog ref="transferDia" v-model="modelValue" width="500px" :title="$t('下级转账')" :confirmLoading="transformLoading"
      :showCancelBtn="false" :confirmText="$t('确认转账')" contentPadding="26px 40px 0"
      @close="$emit('update:modelValue', false)" @onConfirm="handleConfirm" footerBtnWidth="100%"
      :titleBottomBorder="true" blockBtn>
      <div class="transform-body-wrap">
        <div class="description">
          <span>
            {{ $t('转账至:') }}
            <i>{{ target.username }}</i>
          </span>
          <span>
            {{ $t('代理钱包余额:') }}
            <i>{{ agent.userInfo?.money || 0 }}</i>
          </span>
        </div>
        <div class="description" v-if="subConfig.isCurrency">
          <span>{{ $t('地区:') }}{{ target.region_name }}</span>
          <span>{{ $t('货币:') }}{{ target.currency_name }}</span>
        </div>
        <Form ref="FormRef" :columns="columns" label-position="top">
          <template #getCode>
            <el-button :disabled="running" :loading="getCodeLoading" @click="getCode">{{ $t(`获取验证码`) }}{{ num === 60 ?
                '' : `(${num})`
            }}</el-button>
          </template>
        </Form>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  inject, reactive, ref, watch, watchEffect,
} from 'vue';
import { useInterval } from '@/utils/hooks';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';
import { membertranssmscode, membertrans } from '@/api/agent';

const FormRef = ref(null);
const global = inject('global');
const subConfig = inject('subConfig');
const transferDia = ref(null);

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  target: {
    type: Object,
    default: () => ({}),
  },
});

const $store = inject('store');
const { agent } = $store.state;

const columns = reactive([
  {
    label: global.$t('转账金额'),
    placeholder: global.$t('请输入转账金额'),
    type: 'input',
    prop: 'money',
    rule: [{
      required: true,
      triggered: 'blur',
      message: global.$t('请输入转账金额'),
    }],
  },
  {
    label: global.$t('绑定手机'),
    type: 'input',
    disabled: true,
    prop: 'mobile',
    slot: 'getCode',
    rule: [{
      required: true,
      triggered: 'blur',
      message: global.$t('请绑定手机'),
    }],
  },
  {
    placeholder: global.$t('请输入验证码'),
    type: 'input',
    prop: 'code',
    rule: [{
      required: true,
      triggered: 'blur',
      message: global.$t('请输入验证码'),
    }],
  },
]);

watchEffect(() => {
  if (FormRef.value?.data) {
    FormRef.value.data.mobile = agent.userInfo.mobile ?? '';
  }
});

const num = ref(60);
const { run: runInterval, stop: stopInterval, running } = useInterval(() => {
  num.value -= 1;
  console.log('timer', num.value);
  if (num.value === 0) {
    stopInterval();
    num.value = 60;
  }
}, 1000, { manual: true });

const { run: getCode, loading: getCodeLoading } = useRequest(
  () => membertranssmscode({
    mobile: agent.userInfo.mobile,
    phone_area_code: agent.userInfo.phone_area_code,
  }),
  {
    manual: true,
    onSuccess: () => {
      runInterval();
    },
  },
);

const { run: doTranform, loading: transformLoading } = useRequest(
  () => membertrans({
    ...FormRef.value.data,
    username: props.target.username,
  }),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('转账成功'));
      global.$store.dispatch('agent/getUserInfo');
      // emit('close');
      transferDia.value.closeDialog();
    },
  },
);

function handleConfirm() {
  FormRef.value.form.validate((valid) => {
    if (valid) {
      global.$confirm(global.$t('确认转账？'), {
        confirmButtonText: global.$t('确定'),
        cancelButtonText: global.$t('取消'),
        type: 'warning',
      })
        .then(doTranform);
    }
  });
}
</script>

<style lang="scss" scoped>
.description {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  color: var(--font-color-222930);

  i {
    font-family: moneyFont;
    font-style: normal;
  }
}

:deep(.el-form-item) {
  margin-bottom: 22px !important;
}

:deep(.el-form-item__content) {
  display: flex;

  .el-button {
    margin-left: 20px;
  }
}
</style>
