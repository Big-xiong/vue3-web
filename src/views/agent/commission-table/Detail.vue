<template>
  <div class="detail-dialog-wrap">
    <Dialog v-model="modelValue" width="840px" :showBtn="false" :title="$t('每日详情')" :confirmLoading="detailLoading"
      @close="$emit('update:modelValue', false)" :titleBottomBorder="true">
      <div class="detail-body-wrap" v-loading="noticeLoading">
        <Table :loading="detailLoading" :columns="tableColumns" :data="data.tableData || []" stripe
          :total="data.pager.total" :current_page="data.pager.page" :pageUpdate="pageUpdate" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { useRequest } from 'ahooks-vue';
import {
  withDirectives, resolveDirective
} from 'vue';
import Dialog from '@/components/Dialog/index.vue';
import Table from '@/components/Table/index.vue';
import { agentsheet } from '@/api/agent';

const global = inject('global');
const $store = inject('store');
const { agent } = $store.state;
const currency = computed(() => agent?.userInfo?.currency?.symbol);

const moneyDirective = resolveDirective('money');
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true,
  },
  start: {
    type: String,
    default: '',
  },
  end: {
    type: String,
    default: '',
  },
});

function setMoney(value) {
  return withDirectives(h('span'), [[moneyDirective, [currency.value, value]]])
}

const tableColumns = reactive([
  {
    prop: 'date',
    label: global.$t('时间'),
    width: 120,
  },
  {
    prop: 'valid_member_cnt',
    label: global.$t('有效人数'),
  },
  {
    prop: 'recharge',
    label: global.$t('存款'),
    width: 120,
    formatter: (row) => setMoney(row.recharge),
  },
  {
    prop: 'withdraw',
    label: global.$t('取款'),
    width: 120,
    formatter: (row) => setMoney(row.withdraw),
  },
  {
    prop: 'bet',
    label: global.$t('有效投注'),
    width: 120,
    formatter: (row) => setMoney(row.bet),
  },
  {
    prop: 'payout',
    label: global.$t('派彩'),
    width: 120,
    formatter: (row) => setMoney(row.payout),
  },
  {
    prop: 'bonus',
    label: global.$t('红利'),
    width: 120,
    formatter: (row) => setMoney(row.bonus),
  },
  {
    prop: 'gross_profit',
    label: global.$t('纯利'),
    width: 120,
    formatter: (row) => setMoney(row.money_gross_profit),
  },
]);
const data = reactive({
  pager: {},
  tableData: [],
});
const { run: doDetail, loading: detailLoading } = useRequest(
  (params) => agentsheet({
    ...params,
    size: 10,
    start_date: props.start,
    end_date: props.end,
  }),
  {
    manual: true,
    onSuccess(res) {
      data.tableData = res.list;
      data.pager = res.pager;
    },
  },
);
function pageUpdate(page) {
  doDetail({ page });
}

watch(() => props.modelValue, (newVal) => {
  newVal && doDetail();
});

</script>
