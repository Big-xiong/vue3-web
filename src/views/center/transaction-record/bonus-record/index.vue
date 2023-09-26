<template>
  <div class="bonus-record-wrap">
    <FilterBar @search="search" :type="4" @currencyChange="currencyChange" />
    <div class="record-amount">
      <div>
        <p v-money="date.stat[4]"></p>
        <p>{{ $t('已领取红利') }}</p>
      </div>
    </div>
    <div class="record-wrap-table">
      <el-space direction="vertical">
        <ConfigTable :loading="recordLoading" :data="date.recordList" :columns="date.columns" :total="date.total"
          :current="date.current" :pageSize="date.pageSize" :pageUpdate="pageUpdate" stripe />
      </el-space>
    </div>
    <div class="record-nodata" v-show="date.noData">
      <!--      <img-->
      <!--        src="/src/assets/images/center/trans/qk.png"-->
      <!--        alt-->
      <!--      />-->
      <svg-icon name="jiaoyi" />
      <p>{{ $t('非常抱歉未查询到任何红利记录') }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, watch, ref, withDirectives, resolveDirective, h,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import ConfigTable from '@/components/Table/index.vue';
import {
  benefitlist,
} from '@/api/center';
import FilterBar from '../../components/FilterBar.vue';

const moneyDirective = resolveDirective('money');
const global = inject('global');
const date = reactive({
  noData: false,
  startTime: '',
  endTime: '',
  current: 1,
  recordList: [],
  columns: [],
  total: 0,
  pageSize: 0,
  stat: {},
  loaded: true,
});
const searchData = reactive({
  inte_currency_id: null,
});

const $store = inject('store');
$store.dispatch('app/getDict', ['allplatform']);
const { user } = $store.state;

watch(() => user.userInfo, () => {
  searchData.inte_currency_id = user?.userInfo?.inte_currency_id;
}, { immediate: true });

const { run: recordRun, loading: recordLoading } = useRequest(
  () => benefitlist({
    page: date.current, start_time: date.startTime || '', end_time: date.endTime || '', ...searchData,
  }),
  {
    manual: false,
    onSuccess: (res, params) => {
      date.columns = [
        { prop: 'money', label: global.$t('红利金额'), formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.money]]]) },
        { prop: 'name', label: global.$t('优惠红利名称') },
        { prop: 'flow', label: global.$t('流水倍数') },
        { prop: 'updated_at', label: global.$t('领取时间') },
      ];
      date.recordList = res.data;
      date.total = res.total;
      date.pageSize = res.per_page;
      date.stat = res.stat;
      date.noData = !res.data.length;
    },
  },
);
function pageUpdate(val) {
  date.current = val;
  recordRun();
}

function search(data) {
  Object.assign(searchData, data);
  recordRun();
}

function currencyChange(data) {
  searchData.inte_currency_id = data;
  recordRun();
}
</script>

<style lang="scss" scoped>
:deep(.el-table__empty-block) {
  display: none;
}

.record-nodata {
  padding: 0 0 200px;
  margin-top: -100px;
}
</style>
