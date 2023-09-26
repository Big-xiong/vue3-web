<template>
  <div class="history-wrap">
    <div class="layout-flex-between record-searchBar">
      <div class="layout-flex-center record-searchBar-date">
        <el-date-picker
          v-model="dataObj.startTime"
          type="date"
          format="YYYY-MM-DD"
          :placeholder="$t('开始时间')"
        />
        <span class="line" />
        <el-date-picker
          class="el-date-editor-end"
          v-model="dataObj.endTime"
          type="date"
          format="YYYY-MM-DD"
          :placeholder="$t('最后时间')"
        />
      </div>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="recordRun"
        :loading="recordLoading"
      >{{ $t('查询') }}</el-button>
    </div>
    <el-space direction="vertical" v-if="!dataObj.noData">
      <ConfigTable
        :data="dataObj.recordList"
        :columns="dataObj.columns"
        v-loading="recordLoading"
        :current="dataObj.current"
        :total="dataObj.total"
        :pageUpdataObj="pageUpdataObj"
        stripe
      ></ConfigTable>
    </el-space>
    <div class="record-nodata" v-show="dataObj.noData">
      <!-- <img src="/src/assets/images/center/rebate/empty@2x.png" alt /> -->
      <svg-icon name="rebate-empty" />
      <p>{{ $t('您没有任何洗码记录，请多多游戏进行洗码!') }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, h, withDirectives, resolveDirective, computed
} from 'vue';
import dayjs from 'dayjs';
import { useRequest } from 'ahooks-vue';
import { washcoderecord } from '@/api/center';
import ConfigTable from '@/components/Table/index.vue';

const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
});

const global = inject('global');
const dataObj = reactive({
  startTime: '',
  endTime: '',
  noData: false,
  recordList: [],
  columns: [],
  total: 0,
  current: 1,
});

const startTime = computed(() => dataObj.startTime ? dayjs(dataObj.startTime).format('YYYY-MM-DD ') + '00:00:00' : '');
const endTimeLast = computed(() => dataObj.endTime ? dayjs(dataObj.endTime).format('YYYY-MM-DD ') + '23:59:59' : '');

const moneyDirective = resolveDirective('money');
const { run: recordRun, loading: recordLoading } = useRequest(
  () => washcoderecord({
    page: dataObj.current,
    start_time: startTime.value,
    end_time: endTimeLast.value,
  }),
  {
    manual: false,
    onSuccess: (res, params) => {
      dataObj.columns = [
        {
          prop: 'created_at',
          label: global.$t('洗码时间'),
        },
        {
          prop: 'game_type',
          label: global.$t('游戏类型'),
          formatter: (row) => props.list?.filter((item) => item.game_cate_id === row.game_type)[0]?.name ?? '',
        },
        {
          prop: 'proportion',
          label: global.$t('洗码比例'),
          formatter: (row) => (row.proportion ? (`${row.proportion}%`) : '-'),
        },
        {
          prop: 'money',
          label: global.$t('洗码金额'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, row.money]]),
        },
        {
          prop: 'status_text',
          align: 'center',
          label: global.$t('洗码状态'),
        },
      ];
      dataObj.recordList = res.data;
      dataObj.total = res.total;
      dataObj.stat = res.stat;
      dataObj.noData = !res.data.length;
    },
  },
);
function pageUpdataObj(val) {
  dataObj.current = val;
  recordRun();
}
</script>

<style lang="scss" scoped>
.history-wrap {
  .record-searchBar {
    justify-content: flex-start;
    margin-bottom: 20px;

    .el-button {
      margin-left: 20px;
    }
  }

  .config-table-wrap {
    border-top: 1px solid var(--border-color-353435);
  }

  .record-nodata {
    .svg-icon {
      width: 94px;
      height: 60px;
      fill: var(--theme-color) !important;
    }
  }
}
</style>
