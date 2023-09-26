<template>
  <div class="transform-dialog-wrap">
    <Dialog
      v-model="modelValue"
      width="600px"
      :title="$t('佣金调整')"
      :confirmLoading="adjustLoading"
      :showCancelBtn="true"
      :confirmText="$t('确认修改')"
      :cancelText="$t('取消修改')"
      @close="$emit('update:modelValue', false)"
      @onClose="$emit('update:modelValue', false)"
      @onConfirm="handleConfirm"
      :titleBottomBorder="true"
      blockBtn
      footerBtnWidth="100%"
      contentPadding="0 40px"
    >
      <div class="adjust-body-wrap">
        <div class="description">
          <div class="current item">
            <span>{{ $t('当前佣金比例：') }}</span>
            <span>{{ target.rate }}%</span>
          </div>
          <div class="available item">
            <span>{{ $t('可分配佣金比例：') }}</span>
            <span>{{ target.rate_remain }}%</span>
          </div>
        </div>
        <Form ref="FormRef" :columns="columns" label-position="top"></Form>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import { inject, reactive, ref } from 'vue';
import Dialog from '@/components/Dialog/index.vue';
import Form from '@/components/Form/index.vue';
import { membertranssmscode, membertrans, update_commission } from '@/api/agent';

const FormRef = ref(null);
const global = inject('global');

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  target: {
    type: Object,
    default: () => ({})
  },
  onSearch: {
    type: Function,
    default: null
  }
});

const $store = inject('store');
const { agent } = $store.state;

const columns = reactive([
  {
    label: global.$t('新佣金比例'),
    placeholder: global.$t('请输入新佣金比例'),
    type: 'input',
    prop: 'rate',
    rule: [
      {
        required: true,
        triggered: 'blur',
        message: global.$t('请输入新佣金比例')
      },
      {
        validator: (rule, value, callback) => {
          if (Number(value) > 0) {
            callback();
          } else {
            callback(new Error(global.$t('佣金比例需大于0')));
          }
        }
      }
    ]
  }
]);

const emit = defineEmits(['close']);
function handleClose() {
  emit('close');
}

const { run: doAdjust, loading: adjustLoading } = useRequest(
  () =>
    update_commission({
      ...FormRef.value.data,
      agent_id: props.target.id
    }),
  {
    manual: true,
    onSuccess() {
      global.$message.success(global.$t('调整成功'));
      emit('update:modelValue', false);
      props.onSearch ? props.onSearch() : null;
    }
  }
);

function handleConfirm() {
  FormRef.value.form.validate((valid) => {
    // 新佣金比例不能超过剩余可分配比例
    if (Number(FormRef.value.data.rate) > props.target.rate_remain) {
      global.$message.error(global.$t('新佣金比例不能超过可分配佣金比例'));
      return
    }
    if (valid) {
      global
        .$confirm(global.$t('确认修改？'), {
          confirmButtonText: global.$t('确定'),
          cancelButtonText: global.$t('取消'),
          type: 'warning'
        })
        .then(() => {
          // console.log({
          //   ...FormRef.value.data,
          // });
          doAdjust();
        });
    }
  });
}
</script>

<style lang="scss" scoped>
.description {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 20px;

  .item {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: var(--font-color-fff-4, var(--font-color-222930));

    span:nth-child(2) {
      color: var(--theme-color);
    }
  }
}

:deep(.el-form-item__label) {
  color: var(--font-color-999) !important;
}

:deep(.dialog-footer-inline-btn) {
  display: flex;
  flex-direction: column;
}
</style>
