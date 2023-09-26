<template>
  <div class="grow-chart-wrap">
    <div class="grow-chart-wrap-null" v-if="nodata">
      <img src="@/assets/images/agent/zbfx@3x.png" alt="">
      <p>{{ $t('暂无数据！') }}</p>
    </div>
    <template v-else>
      <div id="grow-chart" class="grow-chart"></div>
    </template>
  </div>
</template>

<script setup>
import {
  onMounted, inject, reactive, watch, ref,
} from 'vue';

const loadEcharts = import.meta.glob('/src/utils/loadEcharts.js');

const global = inject('global');
const getRootStyle = inject('getRootStyle');
const chartData = {
  color: [
    '#976346',
    '#9367B5',
    '#0280FF',
  ],
  series: [
    {
      name: global.$t('新增有效会员'),
      type: 'line',
      smooth: true,
      data: [],
    },
    {
      name: global.$t('总新增会员'),
      type: 'line',
      smooth: true,
      data: [],
    },
    {
      name: global.$t('投注人数'),
      type: 'line',
      smooth: true,
      data: [],
    },
    {
      name: global.$t('活跃会员'),
      type: 'line',
      smooth: true,
      data: [],
    },
  ],
  tooltip: {
    trigger: 'axis',
    backgroundColor: getRootStyle('--theme-color', '#app'),
    borderWidth: 0,
    textStyle: {
      color: getRootStyle('--font-color-fff', '#app'),
      textAlign: 'center',
    },
    axisPointer: {
      axis: 'x',
      type: 'line',
    },
  },
  legend: {
    show: true,
    data: [
      global.$t('新增有效会员'),
      global.$t('总新增会员'),
      global.$t('投注人数'),
      global.$t('活跃会员'),
    ],
    textStyle: {
      color: getRootStyle('--font-color-666', '#app'),
    },
    right: 0,
  },
  xAxis: {
    type: 'category',
    axisLine: {
      show: false,
      lineStyle: {
        color: getRootStyle('--border-color-e2e2e2', '#app'),
      },
    },
    splitLine: {
      show: false,
      lineStyle: {
        color: getRootStyle('--border-color-e2e2e2', '#app'),
      },
    },
    axisLabel: {
      fontSize: 14,
      fontFamily: '"Din Alternate", Quicksand, "PingFang SC"',
      color: getRootStyle('--agent-chart-font-color', '#app'),
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false,
      lineStyle: {
        color: getRootStyle('--border-color-e2e2e2', '#app'),
      },
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: getRootStyle('--border-color-e2e2e2', '#app'),
      },
    },
    axisLabel: {
      fontSize: 14,
      fontFamily: '"Din Alternate", Quicksand, "PingFang SC"',
      color: getRootStyle('--agent-chart-font-color', '#app'),
    },
  },
};

const nodata = ref(false);
const props = defineProps({
  sheet: {
    type: Array,
    default: () => [],
  },
});

let chart = null;
let echarts = null;

onMounted(async () => {
  if (!echarts) {
    const echartsModule = await loadEcharts['/src/utils/loadEcharts.js']();
    echarts = echartsModule.default;
  }
  chart = echarts.init(document.getElementById('grow-chart'));
});

watch(() => props.sheet, () => {
  chartData.xAxis.data = props.sheet.active_members.map((item) => item.date);
  chartData.series[0].data = props.sheet.valid_members.map((item) => +item.total);
  chartData.series[1].data = props.sheet.new_members.map((item) => +item.total);
  chartData.series[2].data = props.sheet.bet_members.map((item) => +item.total);
  chartData.series[3].data = props.sheet.active_members.map((item) => +item.total);
  chart.setOption(chartData);
  if (
    !chartData.series[0].data.length
    && !chartData.series[1].data.length
    && !chartData.series[2].data.length
    && !chartData.series[3].data.length
  ) {
    nodata.value = true;
  } else {
    chart.setOption(chartData);
  }
});
</script>

<style lang="scss" scoped>
.grow-chart-wrap {
  .grow-chart {
    width: 900px;
    height: 300px;
    text-align: left;
  }

  &-null {
    text-align: center;
    font-size: 14px;
    height: 100%;
    color: var(--font-color-000);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      width: 80px;
    }
  }
}
</style>
