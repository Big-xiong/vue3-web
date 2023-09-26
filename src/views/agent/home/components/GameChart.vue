<template>
  <div class="game-chart-wrap" v-loading="chartLoading">
    <div class="game-chart-wrap-null" v-if="nodata">
      <!-- <img
        src="@/assets/images/agent/zbfx@3x.png"
        alt
      /> -->
      <svg-icon name="pie" />
      <p>{{ $t('暂无数据！') }}</p>
    </div>
    <template v-else>
      <div class="game-tips">
        <i class="el-icon-warning-outline"></i>
        <span>{{ $t(`代理利润：会员预期金额，正数选定代理抽成越多代理代理：会员利润金额，负数选定代理抽成越少`) }}</span>
      </div>
      <div class="layout-flex-between">
        <div class="game-item" v-for="item in renderOptions" :key="item.content">
          <Tooltip :content="item.content" :tip="item.tip"></Tooltip>
          <div class="chart-wrap" :id="`${item.key}-chart`"></div>
          <div class="text">{{ $t('贡献前三名') }}</div>
          <div class="rank-list">
            <div class="rank-item" v-for="(rank, index) in data.rankData[item.key]" :key="index">
              <img class="crown" :src="$getSrc(`/src/assets/images/level${index + 1}.png`)" alt />
              <div class="name">{{ rank.username }}</div>
              <div class="count" v-money="rank.total"></div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import {
  reactive, inject, onMounted, watch, ref, computed,
} from 'vue';
import Tooltip from '@/views/agent/components/Tooltip.vue';
import {
  agentbetstat, agentuserbetrank,
} from '@/api/agent';

const loadEcharts = import.meta.glob('/src/utils/loadEcharts.js');

const global = inject('global');
const $store = inject('store');
const { agent } = $store.state;
const nodata = ref(false);
const chartLoading = ref(true);
const css_height = computed(() => (nodata.value ? '300px' : '550px'));

const props = defineProps({
  inteCurrencyId: {
    type: Number,
    required: true,
  },
});

const renderOptions = reactive([
  {
    content: global.$t('投注额'),
    tip: '',
    key: 'bet',
    chart: null,
  },
  {
    content: global.$t('代理盈利'),
    tip: global.$t('会员亏损金额，正数越大代理抽成越多'),
    key: 'win',
    chart: null,
  },
  {
    content: global.$t('代理亏损'),
    tip: global.$t('会员盈利金额，负数越大代理抽成越少'),
    key: 'loss',
    chart: null,
  },
]);

const getRootStyle = inject('getRootStyle');
const styled = getComputedStyle(document.body);
const chartData = {
  color: [
    '#976346',
    '#9367B5',
    '#0280FF',
  ],
  legend: {
    show: false,
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: styled.getPropertyValue('--theme-color'),
    borderWidth: 0,
    textStyle: {
      color: getRootStyle('--font-color-000', '#app'),
      textAlign: 'left',
    },
    formatter: (params) => `<p>${params.marker}:&nbsp;&nbsp;${params.name}(${params.percent}%)</p>`,
  },
  responsive: true,
  series: [
    {
      type: 'pie',
      radius: ['30%', '40%'],
      label: {
        // formatter: '{b}',
        position: 'outer',
        textBorderWidth: 0,
        formatter: (params) => `{${params.dataIndex + 1}|${params.name}\n${agent?.currencySymbol}${params.value.toFixed(2)}}`,
        rich: {
          1: {
            color: '#976346',
          },
          2: {
            color: '#B6895C',
          },
          3: {
            color: '#0280FF',
          },
        },
      },
    },
  ],
};

const data = reactive({
  gameData: {
    bet: [],
    win: [],
    loss: [],
  },
  rankData: {
    bet: [],
    win: [],
    loss: [],
  },
});

const { app: { dicts }, game } = $store.state;

async function getGameData() {
  const gameDataHolder = { ...data.gameData };
  const rankDataHolder = { ...data.rankData };
  chartLoading.value = true;

  const fetch = async (key) => Promise.all([agentbetstat({ type: key }), agentuserbetrank({ type: key, inte_currency_id: props.inteCurrencyId })]);

  // eslint-disable-next-line no-restricted-syntax
  for await (const key of Object.keys(gameDataHolder)) {
    const [gameKey, rankKey] = await fetch(key);
    gameDataHolder[key] = gameKey;
    rankDataHolder[key] = rankKey;

    gameDataHolder[key] = gameDataHolder[key].map((subItem) => {
      const holder = { ...subItem };
      if (holder.game_cate_id) {
        holder.game_cate_name = dicts?.platformgameidsv2?.filter((item) => item.game_cate_id === holder.game_cate_id)[0]?.name ?? '';
      }
      return holder;
    });
  }

  data.gameData = gameDataHolder;
  data.rankData = rankDataHolder;
  chartLoading.value = false;

  if (!data.gameData.bet.length && !data.rankData.bet.length) {
    nodata.value = true;
  }
}

$store.dispatch('app/getDict', 'platformgameidsv2');
watch(() => dicts.platformgameidsv2, (res) => {
  getGameData();
});

// if (game?.gameCatePlatforms) {
//   $store.dispatch('game/getAllGameCatePlatforms');
//   watch(() => game.gameCatePlatforms, () => {
//     getGameData();
//   });
// } else {
//   getGameData();
// }

watch(() => props.inteCurrencyId, () => {
  console.log('getGameDATa');
  getGameData();
});

let echarts = null;

onMounted(async () => {
  if (nodata.value) return;
  if (!echarts) {
    const echartsModule = await loadEcharts['/src/utils/loadEcharts.js']();
    echarts = echartsModule.default;
  }
  renderOptions.forEach((item) => {
    item.chart = echarts.init(document.getElementById(`${item.key}-chart`));
    console.log('item.chart');
  });
});

watch(() => data.gameData, () => {
  if (nodata.value) return;
  console.log('data', data.gameData);
  renderOptions.forEach((item) => {
    chartData.series[0].data = data.gameData[item.key].map((subItem) => ({
      value: +subItem.total,
      name: dicts?.platformgameidsv2?.filter((k) => k.game_cate_id === subItem.game_cate_id)[0]?.name ?? '',
    }));
    item.chart.setOption(chartData);
  });
});

</script>

<style lang="scss" scoped>
.game-chart-wrap {
  height: v-bind(css_height); // 550px;
  padding: 0;
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

    .svg-icon {
      width: 80px;
      height: 80px;
      fill: var(--theme-color) !important;
    }
  }

  .game-tips {
    font-size: 14px;
    color: var(--font-color-999);
    text-align: left;
    margin: 20px 0;

    i {
      margin-right: 10px;
    }
  }

  :deep(.tooltip-wrap) {
    color: var(--font-color-f5f5f5);
  }

  .chart-wrap {
    width: 100%;
    height: 330px;
  }

  .text {
    font-size: 14px;
    line-height: 14px;
    margin-bottom: 10px;
    color: var(--font-color-000);
    text-align: left;
  }
}

.rank-item {
  display: flex;
  align-items: center;
  height: 50px;
  border-bottom: solid 1px var(--border-color-e2e2e2);

  .crown {
    width: 28px;
    height: 28px;
    margin-right: 5px;
  }

  .name {
    font-size: var(--font-size);
    margin-right: auto;
    color: var(--font-color-999);
  }

  .count {
    color: var(--font-color-000);
    font-weight: bold;
  }
}

.game-item {
  width: 250px;
}
</style>
