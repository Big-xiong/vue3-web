<template>
  <div class="game-record-wrap">
    <FilterBar :statusArr="date.statusArr" :show="true" :type="5" @search="search" @currencyChange="currencyChange" />
    <div class="record-amount">
      <div>
        <p v-money="date.stat.bet"></p>
        <p>{{ $t('下注金额') }}</p>
      </div>
      <div>
        <p v-money="date.stat.valid_bet"></p>
        <p>{{ $t('有效流水') }}</p>
      </div>
      <div>
        <p v-money="date.stat.win"></p>
        <p>{{ $t('游戏总盈亏') }}</p>
      </div>
    </div>
    <div class="record-wrap-table">
      <el-space direction="vertical">
        <ConfigTable :loading="recordLoading" :data="date.recordList" :columns="date.columns" :total="date.total"
          :current="date.current" :pageSize="date.pageSize" :pageUpdate="pageUpdate" stripe></ConfigTable>
      </el-space>
    </div>
    <div class="record-nodata" v-show="date.noData">
      <!--      <img-->
      <!--        src="/src/assets/images/center/trans/qk.png"-->
      <!--        alt-->
      <!--      />-->
      <svg-icon name="wallet-empty" />
      <p>{{ $t('非常抱歉未查询到任何投注记录') }}</p>
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
  betlog,
} from '@/api/center';
import FilterBar from '../../components/FilterBar.vue';

const moneyDirective = resolveDirective('money');
const global = inject('global');
const $store = inject('store');
const { user, app } = $store.state;
const { dicts } = app;

const date = reactive({
  statusArr: [],
  noData: false,
  startTime: '',
  endTime: '',
  current: 1,
  chooseStatus: 0,
  recordList: [],
  columns: [],
  total: 0,
  stat: {},
  pageSize: 0,
});
const searchData = reactive({
  inte_currency_id: null,
  game_cate_id: 0,
});

$store.dispatch('app/getDict', ['platformgameidsv2', 'allwithdrawstatus']);

watch(() => dicts.platformgameidsv2, () => {
  date.statusArr = [{
    id: 0,
    name: global.$t('全部'),
  },
  ...dicts?.platformgameidsv2?.map((item) => ({
    id: item.game_cate_id,
    name: item.name,
  })) ?? {},
  ];
});

watch(() => user.userInfo, () => {
  searchData.inte_currency_id = user?.userInfo?.inte_currency_id;
}, { immediate: true });

const { run: recordRun, loading: recordLoading } = useRequest(
  () => betlog({
    page: date.current, ...searchData,
  }),
  {
    manual: false,
    onSuccess: (res, params) => {
      date.columns = [
        { label: global.$t('游戏平台'), formatter: (row) => `${row.game_cate_name}-${row.game_platform_name}` },
        { prop: 'game_name', label: global.$t('游戏名称') },
        { prop: 'time', label: global.$t('投注时间'), width: '185px' },
        {
          prop: 'bet',
          label: global.$t('投注金额'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.bet]]]),
        },
        {
          prop: 'valid_wager',
          label: global.$t('有效投注额'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.valid_wager]]]),
        },
        { prop: 'win', label: global.$t('输赢'), formatter: (row) => row.symbol + row.win },
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
  searchData.game_cate_id = data.status;
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
