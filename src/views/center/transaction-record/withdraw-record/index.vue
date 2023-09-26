<template>
  <div class="widthdraw-record-wrap">
    <FilterBar :statusArr="date.statusArr" :type="2" @search="search" @currencyChange="currencyChange" />

    <div class="record-amount">
      <div>
        <p v-money="date.stat[1]"></p>
        <p>{{ $t('审核中') }}</p>
      </div>
      <div>
        <p v-money="date.stat[3]"></p>
        <p>{{ $t('取款失败') }}</p>
      </div>
      <div>
        <p v-money="date.stat[4]"></p>
        <p>{{ $t('出款成功') }}</p>
      </div>
    </div>
    <div class="record-wrap-table">
      <el-space direction="vertical">
        <ConfigTable :loading="recordLoading" :data="date.recordList" :columns="date.columns" :total="date.total"
          :pageSize="date.pageSize" :current="date.current" :pageUpdate="pageUpdate" stripe></ConfigTable>
      </el-space>
    </div>
    <div class="record-nodata" v-show="date.noData">
      <!--      <img-->
      <!--        src="/src/assets/images/center/trans/qk.png"-->
      <!--        alt-->
      <!--      />-->
      <svg-icon name="wallet-empty" />
      <p>{{ $t('非常抱歉未查询到任何取款记录') }}</p>
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
  withdrawlist,
} from '@/api/center';
import FilterBar from '../../components/FilterBar.vue';

const moneyDirective = resolveDirective('money');
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
  stat: {},
  statusArr: [],
  pageSize: 0,
});

const searchData = reactive({
  inte_currency_id: null,
});

const $store = inject('store');
const { dicts } = $store.state.app;
const { user } = $store.state;
$store.dispatch('app/getDict', ['allwithdrawstatus']);

watch(() => dicts.allwithdrawstatus, () => {
  if (dicts?.allwithdrawstatus) date.statusArr = [global.$t('所有状态'), ...Object.values(dicts?.allwithdrawstatus)];
}, { immediate: true });

watch(() => user.userInfo, () => {
  searchData.inte_currency_id = user?.userInfo?.inte_currency_id;
}, { immediate: true });

const { run: recordRun, loading: recordLoading } = useRequest(
  () => withdrawlist({
    page: date.current, ...searchData,
  }),
  {
    manual: false,
    onSuccess: (res, params) => {
      date.columns = [
        { prop: 'trade_no', label: global.$t('交易单号') },
        {
          prop: 'money',
          label: global.$t('取款金额'),
          formatter: (row) => {
            const isBank = row.currency_type === 1;
            return h('div', [h('span', isBank ? '' : [withDirectives(h('span'), [[moneyDirective, [row.expect_dig_number]]]), ' = ']), withDirectives(h('span'), [[moneyDirective, [row.symbol, row.money]]])]);
          },
        },
        {
          prop: 'bank_card_no',
          label: global.$t('取款银行卡'),
          formatter: (row) => {
            const isBank = row.currency_type === 1;
            return `${global.$t(isBank ? '银行卡' : '数字货币')} ${global.$t('尾号')}${(isBank ? row.bank_card_no : row.user_dig_wallet.address)?.slice(-4)}`;
          },
        },
        { prop: 'status', label: global.$t('状态'), formatter: (row) => date?.statusArr[row.status] ?? '' },
        { prop: 'created_at', label: global.$t('提单时间'), width: '115px' },
        { prop: 'updated_at', label: global.$t('出款时间'), width: '115px' },
        { prop: 'remark', label: global.$t('备注') },
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
