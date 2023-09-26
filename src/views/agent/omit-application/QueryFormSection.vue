<template>
  <div class="query-form-wrap">
    <Form :columns="queryColumns" label-width="0" ref="QueryFormRef" @onChange="handleChange" />
    <el-button class="search-btn" @click="search" type="primary" size="large" :loading="loading">{{ $t('查询') }}
    </el-button>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import dayjs from 'dayjs';
import { omitlist } from '@/api/agent';
import Form from '@/components/Form/index.vue';

const stateList = ref([]);
const global = inject('global');
const $store = inject('store');

const queryColumns = reactive([
  [
    [{
      type: 'input',
      prop: 'username',
      placeholder: global.$t('请输入会员账号'),
    },
    {
      type: 'select',
      prop: 'audit_status',
      placeholder: global.$t('请选择状态'),
      list: stateList,
    }],
    [
      {
        pair: false,
        prop: 'start_date',
        type: 'date-picker',
        placeholder: global.$t(`新增时间`),
      },
      {
        pair: false,
        prop: 'end_date',
        type: 'date-picker',
        placeholder: global.$t(`审核时间`),
      },
    ],
  ],
]);

const emit = defineEmits(['searching']);

const { run: getTableData, loading } = useRequest(
  omitlist,
  {
    onSuccess(result) {
      emit('searching', result);
    },
  },
);
const { agent } = $store.state;

watch(
  () => agent.omitStatusList,
  (val) => {
    stateList.value = mapStatus(val);
  },
);

function mapStatus(data) {
  return Object.keys(data).map((key) => ({
    label: data[key],
    value: key,
  }));
}

const QueryFormRef = ref({});
function dateFormat(time) {
  if (!time) return null;
  return dayjs(time).format('YYYY-MM-DD');
}
const search = () => {
  if (QueryFormRef.value) {
    getTableData({
      username: QueryFormRef.value.data.username,
      audit_status: QueryFormRef.value.data.audit_status,
      ask_time: dateFormat(QueryFormRef.value.data.start_date),
      audit_time: dateFormat(QueryFormRef.value.data.end_date),
    });
  } else {
    getTableData({
      audit_status: '',
      ask_time: '',
      audit_time: '',
    });
  }
};

defineExpose({
  loading,
  search,
});
</script>

<style lang="scss" scoped>
.query-form-wrap {
  background-color: var(--bg-color-282828);
  border-radius: 6px;
  margin-top: 20px;
  text-align: left;

  :deep(.el-form-item) {
    margin-right: 20px;
  }

  :deep(.el-input),
  :deep(.el-form-item) {
    max-width: 220px;
    width: 220px;
  }

  :deep(.config-form-wrap-group) {
    justify-content: flex-start;
  }
}

.search-btn {
  align-self: flex-start;
}
</style>
