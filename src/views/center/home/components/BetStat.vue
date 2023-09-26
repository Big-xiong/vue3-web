<template>
  <div class="betStat-wrap" v-loading="chartLoading">

    <div id="customerChart" style="height: 400px;width: 100%;" :class="{ 'hide': !dataObj.nodata }"></div>

    <div class="betStat-wrap-select" v-lang:en="'left: 180px'" v-lang:vi="'left: 160px'" v-if="subConfig.isCurrency">
      <Currency :type="5" @currencyChange="currencyChange" />
    </div>
    <div class="betStat-wrap-nodata" v-if="!dataObj.nodata && !chartLoading">
      <svg-icon name="wallet-empty" />
      <!--      <img src="/src/assets/images/center/trans/qk.png" />-->
      <p>{{ $t('暂无投注记录') }}</p>
    </div>
  </div>
</template>

<script setup>
import {
  inject, onMounted, reactive, watch, ref, nextTick,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import Currency from '@/views/center/components/Currency.vue';
import { mybetstat } from '@/api/center';

const loadEcharts = import.meta.glob('/src/utils/loadEcharts.js');

const getRootStyle = inject('getRootStyle');
const global = inject('global');
const myChart = ref(null);

const dataObj = reactive({
  days: [3, 5, 10, 15],
  day: 3,
  nodata: false,
});
const region = ref('');
const regionId = ref('');
const rows = ref([]);
let echarts = null;

const {
  run: chartRun,
  data: chartData = [],
  loading: chartLoading,
} = useRequest(() => mybetstat({ inte_currency_id: regionId.value }), {
  manual: true,
  formatResult: (res) => {
    rows.value = res.map((item) => item.date);
    const result = res.map((item) => item.bet_money);

    return result;
  },
  onSuccess(res) {
    if (res.length > 0) {
      dataObj.nodata = res.some((ele) => ele !== 0);

      nextTick(() => {
        myChart.value = echarts.init(document.getElementById('customerChart'));
        initChart(res ?? []);
      });
    }
  },
});

const $store = inject('store');
const subConfig = inject('subConfig');

const { dicts } = $store.state.app;
const { user } = $store.state;

const regionIdData = ref([]);
// const customerChart = ref();
function initChart(cData) {
  // 绘制图表
  myChart.value?.setOption?.({
    tooltip: {
      backgroundColor: 'rgba(50, 50, 50, 0.7)',
      borderWidth: '0',
      textStyle: {
        color: '#fff',
      },
      axisPointer: {
        type: 'none',
      },
      formatter(params) {
        const showdata = params;
        return `
              <span>${showdata.name}</span><br />
              <span style="display:inline-block;margin-right:5px;border-radius:50%;width:10px;height:10px;left:5px;background-color:${getRootStyle('--theme-color', '#app')}"></span>${showdata.seriesName}:${showdata.value}
            `;
      },
    },
    legend: {
      show: false,
    },
    grid: {
      left: '60px',
      right: '30px',
      bottom: '60px',
    },
    xAxis: {
      data: rows.value,
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      z: 10,
      axisLabel: {
        showMaxLabel: true,
        formatter: (value) => value?.slice?.(5),
        fontSize: 14,
        fontFamily: '"Din Alternate", Quicksand, "PingFang SC"',
        color: getRootStyle('--font-color-000', '#app'),
      },
    },
    yAxis: {
      splitLine: {
        lineStyle: {
          color: getRootStyle('--yaxis-border-color', '#app'),
        },
      },
      axisLabel: {
        showMaxLabel: true,
        fontSize: 14,
        fontFamily: '"Din Alternate", Quicksand, "PingFang SC"',
        color: getRootStyle('--font-color-000', '#app'),
      },
    },
    series: [{
      name: global.$t(`有效投注额`),
      type: 'bar',
      data: cData,
      itemStyle: {
        color: getRootStyle('--theme-color', '#app'),
        emphasis: {
          color: getRootStyle('--theme-color', '#app'),
        },
      },
      barMaxWidth: 44,
    }],
  });
}

onMounted(async () => {
  if (!echarts) {
    const echartsModule = await loadEcharts['/src/utils/loadEcharts.js']();
    echarts = echartsModule.default;
  }
  chartRun();
});

// watchEffect(() => {
//   initChart(myChart, chartData.value ?? []);
// });

// onBeforeUnmount(() => {
//   myChart = null;
// });

function currencyChange(val) {
  regionId.value = val;
  chartRun();
}

</script>

<style lang="scss" scoped>
.betStat-wrap {
  position: relative;
  height: 400px;

  &-nodata {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    font-size: 14px;
    color: var(--font-color-999);
    text-align: center;

    .svg-icon {
      width: 48px;
      height: 48px;
      fill: var(--theme-color) !important;
    }
  }

  &-btn {
    position: absolute;
    top: 20px;
    right: 0;

    span {
      background-color: var(--bg-color-191919);
      border-radius: 4px;
      line-height: 30px;
      padding: 0 10px;
      min-width: 60px;
      box-sizing: border-box;
      font-size: 14px;
      text-align: center;
      margin-right: 10px;
      cursor: pointer;
      color: var(--font-color-666);

      &.active {
        background-color: var(--theme-color);
        color: var(--font-color-222);
      }
    }
  }

  &-select {
    position: absolute;
    top: -50px;
    left: 140px;

    .el-select {
      width: 104px;
      margin-right: 20px;
    }
  }
}

.hide {
  display: none;
}
</style>
