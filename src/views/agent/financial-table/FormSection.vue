<template>
  <div class="form-wrap">
    <Form :columns="columns" label-width="0" ref="FormRef">
      <template #submit>
        <el-button class="search-btn" :loading="accountLoading || tableDataLoading" @click="getTableData"
          icon="el-icon-search" type="primary">{{ $t('查询') }}</el-button>
      </template>
    </Form>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import Form from '@/components/Form/index.vue';
import { agentaccountchangetype, agentaccountchangelog } from '@/api/agent';

const global = inject('global');
const columns = reactive([
  [
    [
      {
        pair: true,
        prop: 'start_date',
        type: 'date-picker',
        placeholder: global.$t(`开始时间`),
      },
      {
        pair: true,
        prop: 'end_date',
        type: 'date-picker',
        placeholder: global.$t(`截止时间`),
      },
    ],
    {
      type: 'select',
      prop: 'type',
      clearable: true,
      placeholder: global.$t('请选择账变类型'),
      width: '220px',
    },
    {
      type: 'input',
      slot: 'submit',
      prop: 'username',
      placeholder: global.$t('代充帐号'),
      width: '220px',
    },
  ],
]);

const $store = inject('store');
const { agent } = $store.state;
const FormRef = ref(null);
const { run: getAccountType, loading: accountLoading } = useRequest(
  () => agentaccountchangetype(FormRef.value?.data ?? {}),
  {
    manual: true,
    onSuccess(result) {
      $store.dispatch('agent/setMemberAccountType', result);
    },
  },
);

function mapAccountType(data) {
  return Object.keys(data).map((key) => ({
    label: data[key],
    value: key,
  }));
}

if (agent.memberAccountType.length === 0) {
  getAccountType();
} else {
  columns[0][1].list = mapAccountType(agent.memberAccountType);
}

watch(() => agent.memberAccountType, (val) => {
  columns[0][1].list = mapAccountType(val);
});

const emit = defineEmits(['searching']);
const { run: getTableData, loading: tableDataLoading } = useRequest(
  () => {
    if (FormRef.value) {
      const params = {
        start_date: FormRef.value?.data?.start_date && dayjs(FormRef.value?.data.start_date).format('YYYY-MM-DD'),
        end_date: FormRef.value?.data?.end_date && dayjs(FormRef.value?.data.end_date)?.format('YYYY-MM-DD'),
      };
      return agentaccountchangelog({ ...FormRef.value.data, ...params });
    }
    return agentaccountchangelog();
  },
  {
    manual: false,
    onSuccess(result) {
      emit('searching', result);
    },
  },
);

defineExpose({
  loading: tableDataLoading,
  getTableData
})
</script>

<style lang="scss" scoped>
.form-wrap {
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 30px 30px 10px;
  margin-top: 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
    flex: 0;
    max-width: 100%;

    &:nth-child(2) {
      .el-input {
        width: 184px;
      }
    }

    &:last-of-type {
      .el-input {
        width: 93px;
      }
    }
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }

  :deep(.el-form-item__content) {
    display: flex;
    align-items: center;
  }

  :deep(.search-btn) {
    width: 136px;
    height: 40px;
    margin-left: 20px;
  }
}
</style>
