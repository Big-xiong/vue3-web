<template>
  <div class="deposite-record-wrap">
    <FilterBar v-if="!statusLoading" :statusArr="statusArr" :type="1" @search="search"
      @currencyChange="currencyChange" />
    <div class="record-amount">
      <div>
        <p v-money="date.stat[1]"></p>
        <p>{{ $t('未支付') }}</p>
      </div>
      <div>
        <p v-money="date.stat[2]"></p>
        <p>{{ $t('支付成功') }}</p>
      </div>
      <div>
        <p v-money="date.stat[4]"></p>
        <p>{{ $t('支付失败') }}</p>
      </div>
    </div>
    <div class="record-wrap-table" v-loading="loading">
      <el-space direction="vertical">
        <ConfigTable :data="date.recordList" :columns="date.columns" :total="date.total" :pageSize="date.pageSize"
          :current="date.current" :pageUpdate="pageUpdate" :loading="recordLoading" stripe>
          <template #payType="{ row }">
            <span v-if="row.pay_type !== 0">{{ (row.pay_type ? allOrderType?.find((child) => child.id ===
                row.pay_type).name : recordType[row.pay_type])
            }}</span>
            <span v-else>{{ getPayType(row.type) }}</span>
            <!-- <span v-else>{{row.type==1?$t('银行卡转账'):row.type==2?$t('线上支付'):$t('补单')}}</span> -->
          </template>
          <template #status="{ row }">
            <span>{{ statusArr?.[row.status] || '' }}</span>
          </template>
        </ConfigTable>
      </el-space>
    </div>
    <div class="record-nodata" v-if="date.noData && !recordLoading">
      <!--        <img src="/src/assets/images/center/trans/ck.png" alt/>-->
      <svg-icon name="deposit-record-empty" />
      <p>{{ $t('非常抱歉未查询到任何存款记录') }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  withDirectives, resolveDirective
} from 'vue';
import { useRequest } from 'ahooks-vue';
import ConfigTable from '@/components/Table/index.vue';
import {
  allorderstatus, orderlist, allordertype, walletrecordtype,
} from '@/api/center';
import FilterBar from '../../components/FilterBar.vue';

const global = inject('global');
const $store = inject('store');

$store.dispatch('app/getDict', ['regionlist']);

const { dicts } = $store.state.app;
const { user } = $store.state;
const loading = ref(true);

const date = reactive({
  noData: false,
  current: 1,
  recordList: [],
  columns: [
    { prop: 'trade_no', label: global.$t('交易单号'), width: '220px' },
    {
      prop: 'money',
      label: global.$t('存款金额'),
    },
    { prop: 'pay_type', label: global.$t('支付类型'), slot: 'payType' },
    { prop: 'status', label: global.$t('状态'), slot: 'status' },
    { prop: 'updated_at', label: global.$t('时间') },
    { prop: 'remark', label: global.$t('备注') }],
  total: 0,
  stat: {},
  pageSize: 0,
});
const searchData = reactive({
  inte_currency_id: null,
  status: 0,
});

const { data: allOrderType } = useRequest(allordertype);
const { data: recordType } = useRequest(walletrecordtype);

watch(() => user.userInfo, () => {
  searchData.inte_currency_id = user?.userInfo?.inte_currency_id;
}, { immediate: true });

const moneyDirective = resolveDirective('money');
const { run: recordRun, loading: recordLoading } = useRequest(
  () => orderlist({
    page: date.current, ...searchData,
  }),
  {
    manual: true,
    onSuccess: (res, params) => {
      date.columns = [
        { prop: 'trade_no', label: global.$t('交易单号'), width: '220px' },
        {
          prop: 'money',
          label: global.$t('存款金额'),
          formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.money]]]),
        },
        { prop: 'pay_type', label: global.$t('支付类型'), slot: 'payType' },
        { prop: 'status', label: global.$t('状态'), slot: 'status' },
        { prop: 'updated_at', label: global.$t('时间') },
        { prop: 'remark', label: global.$t('备注') },
      ];
      // date.columns[1] = {
      //   prop: 'money',
      //   label: global.$t('存款金额'),
      //   formatter: (row) => withDirectives(h('span'), [[moneyDirective, [row.symbol, row.money]]]),
      // };
      date.recordList = res.data;
      date.total = res.total;
      date.stat = res.stat;
      date.pageSize = res.per_page;
      date.noData = !res.data.length;
      loading.value = false;
    },
  },
);

const { data: statusArr, loading: statusLoading } = useRequest(allorderstatus, {
  formatResult: (data) => [global.$t('所有状态'), ...Object.values(data)],
  onSuccess() {
    recordRun();
  },
});

function pageUpdate(val) {
  date.current = val;
  recordRun();
}

function search(data) {
  Object.assign(searchData, data);
  searchData.type = data.satus;
  recordRun();
}

function currencyChange(data) {
  searchData.inte_currency_id = data;
  recordRun();
}

function getPayType(val) {
  if (val === 1) {
    return global.$t('银行卡转账');
  } if (val === 2) {
    return global.$t('线上支付');
  } if (val === 10) {
    return global.$t('代理内充');
  }
  return global.$t('补单');
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
