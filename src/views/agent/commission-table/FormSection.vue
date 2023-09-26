<template>
  <div class="form-wrap">
    <Form :columns="columns" label-width="0" ref="FormRef" @onChange="handleChange">
      <template #submit>
        <el-button class="search-btn" @click="getTableData" :loading="loading" icon="el-icon-search" type="primary">
          {{ $t('查询') }}</el-button>
      </template>
    </Form>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import dayjs from 'dayjs';
import { agentcommissionlog, agentcommissionstatus } from '@/api/agent';
import Form from '@/components/Form/index.vue';

const global = inject('global');
const columns = reactive([
  [
    {
      pair: true,
      prop: 'start',
      type: 'date-picker',
      slot: 'submit',
      placeholder: global.$t(`开始时间`),
    },
    {
      pair: true,
      prop: 'end',
      type: 'date-picker',
      placeholder: global.$t(`截止时间`),
    },
  ],
]);
const emit = defineEmits(['searching']);

const FormRef = ref(null);
const { run: getTableData, loading } = useRequest(
  (args = {}) => {
    if (FormRef.value) {
      const params = {
        ...args,
        start_date: FormRef.value?.data?.start && dayjs(FormRef.value?.data.start).format('YYYY-MM-DD'),
        end_date: FormRef.value?.data?.end && dayjs(FormRef.value?.data.end).format('YYYY-MM-DD'),
      };
      return agentcommissionlog(params);
    }
    return agentcommissionlog();
  },
  {
    onSuccess(result) {
      emit('searching', result);
    },
  },
);

watch(() => FormRef.value, (val) => {
  // console.log('-------formref.value-----------', FormRef.value);
  if (FormRef.value.data) {
    FormRef.value.data.start = dayjs(new Date()).subtract(7, 'day').toDate();
    FormRef.value.data.end = new Date();
  }
});

const $store = inject('store');
const { agent } = $store.state;

const { run: getCommissionStatus, loading: commissionLoading } = useRequest(
  () => agentcommissionstatus(),
  {
    manual: true,
    onSuccess(result) {
      $store.dispatch('agent/setCommissionStatus', result);
    },
  },
);

if (agent.commissionStatus.length === 0) {
  getCommissionStatus();
}

defineExpose({
  loading,
  getTableData
})
</script>

<style lang="scss" scoped>
.form-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px 30px 8px 30px;
  margin-top: 20px;

  :deep(.el-form-item__content) {
    display: flex;
  }
}

.search-btn {
  margin-left: 10px;
  height: 42px;
  width: 180px;
}
</style>
