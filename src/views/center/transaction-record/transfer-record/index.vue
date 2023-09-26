<template>
  <div class="transfer-record-wrap">
    <FilterBar @search="search" :type="3" @currencyChange="currencyChange" />
    <div class="record-wrap-table">
      <el-space direction="vertical">
        <ConfigTable :loading="recordLoading" :data="date.recordList" :columns="date.columns" :total="date.total"
          :pageSize="date.pageSize" :current="date.current" :pageUpdate="pageUpdate" stripe></ConfigTable>
      </el-space>
    </div>
    <div class="record-nodata" v-show="date.noData">
      <!--      <img-->
      <!--        src="/src/assets/images/center/trans/zz.png"-->
      <!--        alt-->
      <!--      />-->
      <svg-icon name="transfer-record-empty" />
      <p>{{ $t('非常抱歉未查询到任何转账记录') }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, watch, withDirectives, resolveDirective, h,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import ConfigTable from '@/components/Table/index.vue';
import {
  translog,
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
  stat: {},
  allPlat: [],
  pageSize: 0,
});
const $store = inject('store');
$store.dispatch('app/getDict', ['allplatform']);
const { dicts } = $store.state.app;
const { user } = $store.state;

const searchData = reactive({
  inte_currency_id: null,
});

watch(() => user.userInfo, () => {
  searchData.inte_currency_id = user?.userInfo?.inte_currency_id;
}, { immediate: true });

watch(() => dicts.allplatform, () => {
  date.allPlat.push({
    id: 0,
    name: global.$t('主账户'),
  });
  Object.keys(dicts.allplatform).forEach((item) => {
    date.allPlat.push({
      id: item * 1,
      name: dicts.allplatform[item],
    });
  });
});

const { run: recordRun, loading: recordLoading } = useRequest(
  () => translog({
    page: date.current, ...searchData,
  }),
  {
    manual: false,
    onSuccess: (res, params) => {
      date.columns = [
        { prop: 'trade_no', label: global.$t('交易单号') },
        { prop: 'from_platform_id', label: global.$t('转出账户'), formatter: (row) => date.allPlat?.find((item) => item.id === row.from_platform_id)?.name ?? '' },
        { prop: 'money', label: global.$t('转账额度'), formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.money]]]) },
        { prop: 'to_platform_id', label: global.$t('转入账户'), formatter: (row) => date.allPlat?.find((item) => item.id === row.to_platform_id)?.name ?? '' },
        { prop: 'updated_at', label: global.$t('时间') },
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
.transfer-record-wrap {
  .record-searchBar {
    margin-bottom: 30px;
  }
}

:deep(.el-table__empty-block) {
  display: none;
}

.record-nodata {
  padding: 0 0 200px;
  margin-top: -100px;
}
</style>
