<template>
  <div class="charts-wrap">
    <el-tabs
      v-model="activeName"
      class="charts-wrap-tabs"
    >
      <el-tab-pane
        :label="$t('存取趋势图(近7天)')"
        name="first"
      >
        <DepositChart :sheet="data.depositChartData" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('发展趋势图(近15天)')"
        name="second"
      >
        <TrendChart :sheet="data.trendChartData" />
      </el-tab-pane>
      <el-tab-pane
        :label="$t('游戏占比分析(近30天)')"
        name="third"
      >
        <GameChart
          v-if="activeName==='third'"
          :inte-currency-id="inteCurrencyId"
        />
      </el-tab-pane>
      <el-tab-pane disabled>
        <template
          #label
          v-if="subConfig.isCurrency"
        >
          <el-select
            v-model="data.value"
            :placeholder="$t('请选择')"
            size="mini"
          >
            <el-option
              v-for="item in data.options"
              :key="item.name"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import {
  reactive, ref, inject, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import {
  agentdwtrend, agentmemberstrend, currencylist,
} from '@/api/agent';
import DepositChart from './components/DepositChart.vue';
import TrendChart from './components/TrendChart.vue';
import GameChart from './components/GameChart.vue';

const global = inject('global');
const $store = inject('store');
const subConfig = inject('subConfig');

// $store.dispatch('agent/getUserInfo');
// const { agent } = $store.state;
// const inte_currency_id = ref(0);
// inte_currency_id.value = agent.userInfo.inte_currency_id;
// console.log('agent.userInfo', inte_currency_id);

const inteCurrencyId = ref(0);
const activeName = ref('first');
const data = reactive({
  trendChartData: {},
  depositChartData: {},
  options: [],
  value: '',
});

useRequest(
  () => currencylist(),
  {
    onSuccess(result) {
      console.log(result, 'options');
      data.options = result;
      data.value = result[0].id;
    },
  },
);

const { run: memberstrend } = useRequest(
  ({ id }) => agentmemberstrend({ inte_currency_id: id }),
  {
    manual: true,
    onSuccess(result) {
      // result.forEach((result) => {
      //   console.log(result, 'result');
      // });
      data.trendChartData = result;
      console.log(data.trendChartData, 'trendChartData');
    },
  },
);

const { run: dwtrend } = useRequest(
  () => agentdwtrend(),
  {
    manual: true,
    onSuccess: (result) => {
      console.log(result, 'result2');
      data.depositChartData = result;
    },
  },
);

watch(() => data.value, (newValue, oldValue) => {
  console.log(oldValue, newValue, 'oldValue, newValue');
  inteCurrencyId.value = newValue;
  memberstrend({ id: newValue });
  if (subConfig.isCurrency) {
    dwtrend({ inte_currency_id: newValue });
  } else {
    dwtrend();
  }
}, { immediate: true });

</script>

<style lang="scss" scoped>
.charts-wrap {
  margin-top: 20px;
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
  box-sizing: border-box;
  border-radius: 6px;
  padding: 20px 0;
  &-tabs {
    margin: 0 30px;
  }

  :deep(.el-tabs__item) {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    font-size: 14px !important;
    color: var(--font-color-0a0a0a);

    &.is-active {
      color: var(--theme-color);
    }
  }

  :deep(.el-tabs__active-bar) {
    height: 2px;
  }

  :deep(.el-tabs__nav) {
    margin-left: 30px;
  }
  :deep(.el-select) {
    margin-right: 30px;
  }
  :deep(.el-input__inner) {
    height: 28px;
    width: 150px;
  }
}
</style>
