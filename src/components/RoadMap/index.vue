<template>
  <div v-loading="!data.canvasOnReady" class="roadmap">
    <TabSection v-if="isShowTab" @change="onTabChange" :vid="vid" />
    <h4>
      <em v-if="showType === 'table'">{{ vid.replace("00", "0") }}{{ $t('桌') }}</em>
    </h4>
    <div v-show="data.canvasOnReady" class="canvas-wrap">
      <div class="canvas">
        <canvas id="canvas" />
        <div class="dealing" v-if="data.roadmapDatas.noopen">{{ $t("发牌中") }}...</div>
      </div>
      <dt v-if="data.canvasOnReady" ref="mapinfo" class="mapinfo">
        <div class="countdown">{{ data.secondsStr }}</div>
        <p>{{ $t("距离本局结束") }}</p>
      </dt>
    </div>
    <div class="info-wrap" v-show="data.canvasOnReady">
      <span class="game-name">{{ data.tableTtileMaps[data.roadmapDatas.gameType] }}</span>
      <div class="roadmap-statistics">
        <span class="c-banker">{{ $t("庄") }}{{ data.statistics.bankerNum }}</span>
        <span class="c-tie">{{ $t("和") }}{{ data.statistics.tieNum }}</span>
        <span class="c-player">{{ $t("闲") }}{{ data.statistics.playerNum }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {

  inject,
  onMounted,
  onUnmounted,
  reactive,
  watch,
} from 'vue';
// import io from 'socket.io-client';
import { useInterval } from '@/utils/hooks';
import RoadMap from '@/utils/roadmap';
import TabSection from './TabSection.vue';

const props = defineProps({
  isShowTab: {
    type: Boolean,
    default: true,
  },
  vid: {
    type: String,
    default: 'D056',
  },
  canvasWidth: {
    type: Number,
    default: 380,
  },
  canvasHeight: {
    type: Number,
    default: 140,
  },
  cellSize: {
    type: Number,
    default: 20,
  },
  zoom: {
    type: Number,
    default: 2,
  },
  showType: {
    type: String,
    default: 'table',
  },
});

const emit = defineEmits(['change']);
function onTabChange(type) {
  emit('change', type);
}

const $store = inject('store');
const global = inject('global');

const data = reactive({
  tableTtileMaps: {
    BAC: global.$t('经典百家乐'),
    CBAC: global.$t('包桌百家乐'),
    TBAC: global.$t('竞咪百家乐'),
    LBAC: global.$t('现场百家乐'),
    SBAC: global.$t('保险百家乐'),
    BBAC: global.$t('龙宝百家乐'),
    SHB: global.$t('骰宝'),
    DT: global.$t('龙虎'),
    ROU: global.$t('轮盘'),
    TEB: global.$t('二八杠'),
    NN: global.$t('牛牛'),
  },
  roadmap: null,
  canvasOnReady: false,
  vids: [],
  allTables: null,
  tableTypes: [],
  timer: null,
  secondsStr: '00:00',
  vid: props.vid,
  // 庄、闲、和
  statistics: {},
  roadmapDatas: {},
  data: {},
});

onMounted(() => {
  initCanvas();
  initSocket();
});

let canvasCtx = null;

function initCanvas() {
  const canvas = document.querySelector('#canvas');
  canvas.width = props.canvasWidth * props.zoom;
  canvas.height = props.canvasHeight * props.zoom;
  canvas.style.zoom = 1 / props.zoom;
  canvasCtx = canvas.getContext('2d');
}

const { app } = $store.state;
watch(
  () => app.roadmapSocketType,
  (type) => {
    switch (type) {
      case 'resultList':
        onResultList(app.roadmapSocketData);
        break;
      case 'newShoes':
        onNewShoes(app.roadmapSocketData);
        break;
      case 'newRound':
        onNewRound(app.roadmapSocketData);
        break;
      case 'closeRound':
        onCloseRound(app.roadmapSocketData);
        break;
      default:
    }
  },
);

onUnmounted(() => {
  $store.dispatch('app/disconnectSocket');
});

function initSocket() {
  $store.dispatch('app/connectSocket');
}

function getGameTables(gameTableData) {
  const vids = [];
  const allTables = {};
  let { vid } = data;
  const { tableTypes } = data;

  Object.keys(gameTableData).forEach((key) => {
    const tableItem = gameTableData[key];
    const { gameType } = tableItem;
    allTables[key] = gameType;
    if (tableTypes.indexOf(gameType) < 0) {
      tableTypes.push(gameType);
    }
    if (tableItem.roundCount > 0) {
      if (gameType === 'BAC' || gameType === 'CBAC') {
        vids.push(key);
      }
    }
  });

  // 如果没有默认的桌台
  if (!vid) {
    const idx = Math.floor(Math.random() * vids.length);
    vid = vids[idx];
  }

  data.vid = vid;
  data.allTables = allTables;
  data.vids = vids;
}

function initRoadMap(roadmapData) {
  getGameTables(roadmapData);
  const {
    canvasWidth, canvasHeight, zoom, cellSize, vid,
  } = props;
  const { allTables } = data;
  const gameType = allTables[vid];
  const canvasRealWidth = Math.floor(canvasWidth / cellSize) * cellSize;
  data.roadmap = RoadMap({
    canvas: canvasCtx,
    canvasWidth: canvasRealWidth,
    canvasHeight,
    cellSize,
    gameType,
    zoom,
  });
  data.canvasOnReady = true;
}

// 初始化获取到结果
function onResultList(msgData) {
  if (!data.canvasOnReady) {
    initRoadMap(msgData);
  }

  const {
    roadmap, vid, canvasWidth, canvasHeight,
  } = data;
  const vidData = msgData[vid];

  if (vidData.roundCount) {
    data.roadmapDatas.noopen = false;
  }

  // 清除所有数据
  roadmap.removeAll();
  // 设置数据
  roadmap.setIList(vidData);
  // 清空画布
  roadmap.clearDraw(canvasCtx, canvasWidth, canvasHeight);
  // 画网格线
  roadmap.drawPath();
  // 画露珠图
  roadmap.drawBeads();

  data.roadmapDatas = {
    ...data.roadmapDatas,
    gameType: vidData.gameType,
    gmcode: vidData.gmcode,
    roundCount: vidData.roundCount,
    seconds: vidData.seconds,
  };
  // 到计时
  countdown();
  formatStatistics();
}

const { run: runInterval, stop: stopInterval } = useInterval(() => {
  data.roadmapDatas.seconds -= 1;
  if (data.roadmapDatas.seconds <= 0) {
    data.roadmapDatas.seconds = 0;
    countdownStop();
  }
  formatSeconds();
}, 1000, { manual: true });

function countdown() {
  countdownStop();
  runInterval();
}

function formatSeconds() {
  let { seconds } = data.roadmapDatas;
  // 不存在或为0
  if (!seconds) {
    return (data.secondsStr = '00:00');
  }
  const str = '0000';
  seconds += '';
  seconds = str.substr(0, str.length - seconds.length) + seconds;
  seconds = seconds.split('');
  data.secondsStr = `${seconds[0] + seconds[1]}:${seconds[2]}${seconds[3]}`;
}

function formatStatistics(vid) {
  const { roadmap, statistics } = data;
  const { gameType } = data.roadmapDatas;
  const {
    sumbig,
    sumsmall,
    sumdan,
    sumshuang,
    baozi,
    bankerNum,
    playerNum,
    tieNum,
  } = roadmap;
  Object.assign(statistics, {
    sumbig,
    sumsmall,
    sumdan,
    sumshuang,
    baozi,
    bankerNum,
    playerNum,
    tieNum,
  });
}

// 新牌靴
function onNewShoes(msgData) {
  const { vid, canvasWidth, canvasHeight } = props;
  const { roadmap } = data;
  if (vid === msgData.vid) {
    data.roadmapDatas.noopen = true;
    // 清除所有数据
    roadmap.removeAll();
    // 清空画布
    roadmap.clearDraw(canvasCtx, canvasWidth, canvasHeight);
    // 画网格线
    roadmap.drawPath();
    // 画露珠图
    roadmap.drawBeads();
    data.roadmapDatas = {
      ...data.roadmapDatas,
      gameType: msgData.gameType,
      gmcode: msgData.gmcode,
      // roundCount: msgData.roundCount,
      roundCount: 1,
      seconds: msgData.seconds,
    };
    formatStatistics();
  }
}
// 开始新局（发牌）
function onNewRound(msgData) {
  // console.log('new round', msgData.vid, props.vid);
  if (msgData.vid === props.vid) {
    data.roadmapDatas = {
      ...data.roadmapDatas,
      seconds: msgData.seconds,
      noopen: false,
    };
    countdown();
  }
}

function countdownStop() {
  stopInterval();
}

// 结束一局
function onCloseRound(msgData) {
  const _vid = msgData.vid;
  const _gmcode = msgData.gmcode;
  const { vid, canvasWidth, canvasHeight } = props;
  const { roadmap } = data;
  // console.log('closeRound', data.roadmapDatas.gmcode);
  if (vid === msgData.vid && _gmcode !== data.roadmapDatas.gmcode) {
    // 停止倒计时
    countdownStop();
    // 清除除msgData外所有数据
    roadmap?.removeAll();
    // 设置数据
    roadmap.appendIList(msgData);
    // 清空画布
    roadmap.clearDraw(canvasCtx, canvasWidth, canvasHeight);
    // 画网格线
    roadmap.drawPath();
    // 画露珠图
    roadmap.drawBeads();
    data.roadmapDatas = {
      ...data.roadmapDatas,
      gmcode: _gmcode,
      roundCount: msgData.round,
      noopen: true,
    };

    formatStatistics();
  }
}
</script>

<style lang="scss" scoped>
.roadmap {
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  padding: 15px;
  background-color: var(--bg-color-282828);

  h4 {
    margin: 5px 0 15px 0;
    text-align: left;
    font-size: 14px;
    color: var(--font-color-a7a7a7);
  }

  .canvas-wrap {
    display: flex;
  }

  em {
    font-style: normal;
  }

  dd {
    margin-left: 0;
  }

  .mapinfo {
    width: 122px;
    height: 100%;
    text-align: center;
    font-size: 18px;
    margin-left: 50px;

    h4 {
      font-weight: 400;
      color: var(--font-color-999);
      line-height: 25px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      em,
      span {
        display: inline-block;
        vertical-align: middle;
      }

      em {
        background-image: linear-gradient(135deg,
            var(--font-color-ff6680),
            rgba(var(--font-color-ff6680), 0.4));
        font-style: normal;
        color: var(--font-color-fff);
        line-height: 1;
        padding: 2px 5px;
        border-radius: 2px;
        text-transform: uppercase;
        margin-right: 5px;
      }
    }

    p {
      color: var(--font-color-999);
      margin: 10px 0;
      text-align: center;
    }

    [data-round] {
      color: var(--font-color-ff6680);
    }

    .countdown {
      text-align: center;
      color: var(--font-color-fff);
      line-height: 39px;
      font-size: 30px;
      font-weight: bold;
      margin-top: 8px;
    }
  }

  .canvas {
    position: relative;
    float: left;

    .dealing {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      line-height: 30px;
      text-align: center;
      color: var(--font-color-999);
      font-weight: 300;
      font-size: 30px;
      letter-spacing: 5px;
      transform: translateY(-50%);
    }
  }

  .info-wrap {
    overflow: hidden;
    margin-top: 23px;
    display: flex;
    align-items: center;

    .game-name {
      font-size: 14px;
      color: var(--font-color-fff);
      margin-right: 40px;
    }

    em {
      color: var(--font-color-999);
    }

    h4 {
      color: var(--font-color-fff);
      font-size: 14px;
      line-height: 24px;
      float: left;
      padding-right: 30px;
      margin: 0;
    }

    >.roadmap-statistics {

      >span {
        padding: 0 10px;
        font-size: 14px;
        line-height: 24px;
      }

      .c-banker {
        color: var(--font-color-f66);
      }

      .c-player {
        color: var(--font-color-7c86e9);
      }

      .c-tie {
        color: var(--font-color-7fe1df);
      }
    }
  }
}
</style>
