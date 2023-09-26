<template>
  <div
    ref="chartRef"
    class="user-profit-wrap"
  >
    <div id="user-profit-chart"></div>
  </div>
</template>

<script setup>
import {
  ref, inject, onMounted, onBeforeUnmount, watch,
} from 'vue';
import { useInViewport } from 'ahooks-vue';
import * as echarts from 'echarts';

const chartRef = ref(null);
const isInViewport = useInViewport(chartRef);

const getRootStyle = inject('getRootStyle');
const chartOption = {
  color: getRootStyle('--theme-color', '#app'),
  legend: {
    show: false,
    textStyle: {
      color: getRootStyle('--font-color-ccc', '#app'),
    },
  },
  series: [
    {
      data: [5, 20, 15, 25, 5],
      type: 'bar',
    },
  ],
  tooltip: {
    show: false,
  },
  yAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: getRootStyle('--border-color-000-1', '#app'),
      },
    },
    splitLine: {
      lineStyle: {
        color: getRootStyle('--border-color-000-1', '#app'),
      },
    },
    axisLabel: {
      // show: false,
      formatter: (value) => '',
      showMaxLabel: true,
      fontSize: 14,
      fontFamily: '"Din Alternate", Quicksand, "PingFang SC"',
      color: getRootStyle('--font-color-666', '#app'),
    },
  },
  xAxis: {
    data: ['A', 'B', 'C', 'D', 'E'],
    type: 'category',
    axisLine: {
      show: true,
      lineStyle: {
        color: getRootStyle('--border-color-000-1', '#app'),
      },
    },
    splitLine: {
      lineStyle: {
        color: getRootStyle('--border-color-000-1', '#app'),
      },
    },
    z: 10,
    axisLabel: {
      formatter: (value) => value.slice(-5),
      showMaxLabel: true,
      fontSize: 14,
      fontFamily: '"Din Alternate", Quicksand, "PingFang SC"',
      color: getRootStyle('--font-color-ccc', '#app'),
    },
  },
};

let myChart;
function init() {
  myChart = echarts.init(document.body.querySelector('#user-profit-chart'));
  myChart.setOption(chartOption);
}

onMounted(() => {
  init();
});

watch(isInViewport, () => {
  if (isInViewport.value) {
    myChart.dispose();
    init();
  }
});

onBeforeUnmount(() => {
  myChart.dispose();
});

</script>

<style scoped>
.user-profit-wrap {
  width: 100%;
}

#user-profit-chart {
  margin: -40px auto 0;
  width: 260px;
  height: 260px;
}
</style>
