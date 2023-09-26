<template>
  <div class="record-wrap">
    <div class="layout-flex-between record-searchBar">
      <div class="layout-flex-center record-searchBar-date">
        <el-date-picker v-model="date.startTime" type="date" format="YYYY-MM-DD" :placeholder="$t('开始时间')" />
        <span class="line" />
        <el-date-picker class="el-date-editor-end" v-model="date.endTime" type="date" format="YYYY-MM-DD"
          :placeholder="$t('最后时间')" />
      </div>
      <el-select v-model="date.chooseStatus" :placeholder="$t('请选择')" class="state_middle" @change="recordRun">
        <el-option v-for="(item, index) in statusArr" :key="index" :label="item" :value="index" />
      </el-select>
      <el-button type="primary" icon="el-icon-search" @click="recordRun" :loading="recordLoading">{{ $t('查询') }}
      </el-button>
    </div>
    <el-space direction="vertical" v-if="!date.noData">
      <ConfigTable :data="date.recordList" :columns="date.columns" v-loading="recordLoading" :total="date.total"
        :current="date.current" :pageUpdate="pageUpdate" stripe>
        <template #typeSlot="{ row }">
          <span v-if="statusArr">{{ statusArr[row.type * 1] ?? '' }}</span>
        </template>
      </ConfigTable>
    </el-space>
    <div class="record-nodata" v-show="date.noData">
      <img src="/src/assets/images/center/financial/empty@2x.png" alt />
      <p>{{ $t('暂无交易记录') }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import ConfigTable from '@/components/Table/index.vue';
import {
  allmoneytranstype, transrecord,
} from '@/api/center';

const props = defineProps({
  refreshData: {
    type: Boolean,
    default: true,
  },
});

const global = inject('global');
const date = reactive({
  noData: false,
  startTime: '',
  endTime: '',
  current: 1,
  chooseStatus: 0,
  recordList: [],
  columns: [],
  total: 0,
});

const { run: statusRun, data: statusArr } = useRequest(allmoneytranstype, {
  formatResult: (data) => [global.$t('全部类型'), ...Object.values(data)],
});
// console.log(statusArr);

const { run: recordRun, loading: recordLoading } = useRequest(
  () => transrecord({
    page: date.current, type: date.chooseStatus || '', start_time: date.startTime || '', end_time: date.endTime || '',
  }),
  {
    manual: false,
    onSuccess: (res, params) => {
      date.columns = [
        {
          prop: 'created_at',
          label: global.$t('交易时间'),
          width: '210px',
        },
        {
          prop: 'trade_no',
          label: global.$t('交易订单'),
          width: '210px',
        },
        {
          prop: 'type',
          label: global.$t('类型'),
          slot: 'typeSlot',
        },
        {
          prop: 'money',
          label: global.$t('金额'),
        },
        {
          prop: 'rate',
          label: global.$t('年利率'),
          formatter: (row) => `${(row.rate * 100).toFixed(2)}%`,
        },
        {
          prop: 'day',
          label: global.$t('收益天数（天）'),
          width: 140,
        },
      ];
      date.recordList = res.data;
      date.total = res.total;
      date.noData = !res.data.length;
    },
  },
);
function pageUpdate(val) {
  date.current = val;
  recordRun();
}

watch(() => props.refreshData, () => {
  if (props.refreshData) recordRun();
});
</script>

<style lang="scss" scoped>
.record-wrap {
  background-color: var(--bg-color-282828);
  border-radius: 10px;
  margin-top: 20px;
  padding: 30px;
  border: 1px solid var(--border-color-e2e2e2);
  box-sizing: border-box;

  .record-searchBar {
    margin-bottom: 20px;
  }

  .record-nodata {
    padding: 50px 0;
  }
}
</style>
