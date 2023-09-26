<template>
  <div class="deposit-wrap">
    <div class="deposit-wrap-null" v-if="nodata">
      <img src="@/assets/images/agent/zbfx@3x.png" alt />
      <p>{{ $t('暂无数据！') }}</p>
    </div>
    <template v-else>
      <div id="deposit-chart"></div>
    </template>
  </div>
</template>

<script setup>
import {
  inject, watch, onMounted, reactive, ref,
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
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
    backgroundColor: getRootStyle('--theme-color', '#app'),
    borderWidth: 0,
    textStyle: {
      color: getRootStyle('--font-color-fff', '#app'),
      textAlign: 'left',
    },
  },
  legend: {
    data: [global.$t('存款'), global.$t('取款'), global.$t('存取差')],
    textStyle: {
      color: getRootStyle('--font-color-999', '#app'),
    },
    right: 0,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'value',
    boundaryGap: [0, 0.01],
    axisLine: {
      show: false,
      lineStyle: {
        color: getRootStyle('--border-color-e2e2e2', '#app'),
      },
    },
    splitLine: {
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
  series: [
    {
      name: global.$t('存款'),
      type: 'bar',
      data: [1, 2, 4, 5],
    },
    {
      name: global.$t('取款'),
      type: 'bar',
      data: [1, 2, 4, 5],
    },
    {
      name: global.$t('存取差'),
      type: 'bar',
      data: [1, 2, 4, 5],
    },
  ],
};
const nodata = ref(false);
const props = defineProps({
  sheet: {
    type: Object,
    default: () => { },
  },
});

let chart = null;
let echarts = null;

onMounted(async () => {
  if (!echarts) {
    const echartsModule = await loadEcharts['/src/utils/loadEcharts.js']();
    echarts = echartsModule.default;
  }
  chart = echarts.init(document.getElementById('deposit-chart'));
});

watch(() => props.sheet, () => {
  chartData.yAxis.data = props?.sheet?.deposit?.map((item) => item.date);
  chartData.series[0].data = props?.sheet?.deposit?.map((item) => +item.total);
  chartData.series[1].data = props?.sheet?.withdraw?.map((item) => +item.total);
  chartData.series[2].data = props?.sheet?.sub?.map((item) => +item.total);

  if (
    !chartData.series[0].data.length
    && !chartData.series[1].data.length
    && !chartData.series[2].data.length
  ) {
    nodata.value = true;
  } else {
    chart.setOption(chartData);
  }
});

</script>

<style lang="scss" scoped>
#deposit-chart {
  width: 900px;
  height: 300px;
  text-align: left;

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
