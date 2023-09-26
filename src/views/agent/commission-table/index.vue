<template>
  <div class="commission-table-wrap">
    <FormSection @searching="handleSearching" ref="form" />
    <div class="statistic-wrap">
      <div class="statistic-item" v-for="item in statisticList" :key="item.label">
        <div class="type-name">{{ item.label }}</div>
        <template v-if="item.noMoney">
          <div class="value">{{ item.value }}</div>
        </template>
        <span v-else class="value" v-money="item.value" />
      </div>
    </div>
    <TableSection v-bind="tableData" :loading="form?.loading" @pageUpdate="getTableData" />
  </div>
</template>

<script setup>
import { inject, reactive } from 'vue';
import FormSection from './FormSection.vue';
import TableSection from './TableSection.vue';

const global = inject('global');
const statisticList = reactive([
  {
    label: global.$t('有效人数'),
    prop: 'valid_members',
    value: 0,
    noMoney: true
  },
  {
    label: global.$t('总投注'),
    prop: 'bet',
    value: 0,
  },
  {
    label: global.$t('派彩'),
    prop: 'win',
    value: 0,
  },
  {
    label: global.$t('红利'),
    prop: 'bonus',
    value: 0,
  },
  {
    label: global.$t('平台费'),
    prop: 'platform_fee',
    value: 0,
  },
  {
    label: global.$t('纯利'),
    value: 0,
    prop: 'profit',
  },
  {
    label: global.$t('未结算佣金'),
    value: 0,
    prop: 'no_checked_commission',
  },
  {
    label: global.$t('已结算佣金'),
    prop: 'checked_commission',
    value: 0,
  },
]);

const tableData = ref({});

function handleSearching(event) {
  const { stat, data, total, current_page } = event;
  statisticList.forEach((item) => {
    item.value = stat[item.prop] || 0;
  });
  tableData.value = {
    data,
    total,
    current_page
  }
}

const form = ref(null)

function getTableData(params) {
  form.value?.getTableData(params)
}
</script>

<style lang="scss" scoped>
.statistic-wrap {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  margin-right: -15px;

  .statistic-item {
    border: solid 1px var(--block-border-color);
    background-color: var(--block-bg-color);
    box-sizing: border-box;
    border-radius: 6px;
    padding: 20px 10px;
    box-sizing: border-box;
    margin-right: 15px;
    flex: 1;

    .type-name {
      font-size: 14px;
      text-align: center;
      color: var(--font-color-999);
    }

    .value {
      text-align: center;
      margin-top: 15px;
      font-size: 18px;
      font-weight: bold;
      color: var(--font-color-000);
      font-family: moneyFont;
    }
  }
}
</style>
