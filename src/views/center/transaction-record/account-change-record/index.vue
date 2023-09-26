<template>
  <div class="account-change-record-wrap">
    <FilterBar :show="true" :statusArr="statusArr" :type="3" @search="search" @currencyChange="currencyChange" />
    <div class="record-amount">
      <div>
        <p v-money="walletInfo?.profit_money"></p>
        <p>{{ $t('游戏总盈亏') }}</p>
      </div>
      <div>
        <p v-money="walletInfo?.recharge_money"></p>
        <p>{{ $t('总存款') }}</p>
      </div>
      <div>
        <p v-money="walletInfo?.withdraw_money"></p>
        <p>{{ $t('总取款') }}</p>
      </div>
    </div>
    <div class="record-wrap-table">
      <el-space direction="vertical">
        <ConfigTable :loading="recordLoading" :data="date.recordList" :columns="date.columns" :current="date.current"
          :total="date.total" :pageSize="date.pageSize" :pageUpdate="pageUpdate" stripe></ConfigTable>
      </el-space>
    </div>
    <div class="record-nodata" v-show="date.noData">
      <!--      <img-->
      <!--        src="/src/assets/images/center/trans/qk.png"-->
      <!--        alt-->
      <!--      />-->
      <svg-icon name="tzjl" />
      <p>{{ $t('非常抱歉未查询到任何账变记录') }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, watch, withDirectives, resolveDirective, h,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import {
  walletrecordtype, walletrecord, walletrecordinfo,
} from '@/api/center';
import ConfigTable from '@/components/Table/index.vue';
import FilterBar from '../../components/FilterBar.vue';

const moneyDirective = resolveDirective('money');
const global = inject('global');
const $store = inject('store');
const { user } = $store.state;
const date = reactive({
  noData: false,
  startTime: '',
  endTime: '',
  current: 1,
  chooseStatus: 0,
  recordList: [],
  columns: [],
  total: 0,
  pageSize: 0,
});
const searchData = reactive({
  type: 0,
  inte_currency_id: null,
});

const { data: statusArr } = useRequest(walletrecordtype, {
  formatResult: (data) => {
    const arr = [];
    Object.keys(data).forEach((item) => {
      arr.push({
        id: item * 1,
        name: data[item],
      });
    });
    return [...[{ id: 0, name: global.$t('所有类型') }], ...arr];
  },
});
const { run: walletInfoRun, data: walletInfo } = useRequest(walletrecordinfo);
const { run: recordRun, loading: recordLoading } = useRequest(
  () => walletrecord({
    page: date.current, ...searchData,
  }),
  {
    manual: true,
    onSuccess: (res, params) => {
      date.columns = [
        {
          prop: 'type',
          label: global.$t('账变类型'),
          formatter: (row) => statusArr.value?.find((item) => item.id === row.type)?.name ?? '',
        },
        { prop: 'updated_at', label: global.$t('账变时间'), width: '185px' },
        {
          prop: 'money',
          label: global.$t('账变金额'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.money]]]),
        }, {
          prop: 'before_money',
          label: global.$t('账变前余额'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.before_money]]]),
        }, {
          prop: 'after_money',
          label: global.$t('账变后金额'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.after_money]]]),
        }, {
          prop: 'game_profit',
          label: global.$t('游戏盈亏'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.game_profit]]]),
        }, {
          prop: 'freeze',
          label: global.$t('冻结资金'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.freeze]]]),
        },
      ];
      date.recordList = res.data;
      date.pageSize = res.per_page;
      date.current = res.current_page;
      date.total = res.total;
      date.noData = !res.data.length;
    },
  },
);

watch(() => user.userInfo, () => {
  searchData.inte_currency_id = user?.userInfo?.inte_currency_id;
  recordRun();
}, { immediate: true });

function pageUpdate(val) {
  date.current = val;
  recordRun();
}

function search(data) {
  const { status, ...args } = data;
  Object.assign(searchData, { ...args, type: data.status });
  recordRun();
  walletInfoRun();
}

function currencyChange(data) {
  searchData.inte_currency_id = data;
  recordRun();
}
</script>

<style lang="scss" scoped>
.record-nodata {
  .svg-icon-wrap {
    width: 47px;
    height: 50px;
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
