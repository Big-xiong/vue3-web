<template>
  <div class="statistic-count-wrap">
    <header class="layout-flex-between">
      <span>{{ $t('数据统计(团队)') }}</span>
      <p><i class="el-icon-warning-outline"></i><span>{{ $t(`纯利=有效投注-派奖金额-红利金额-平台费`) }}</span></p>
    </header>

    <div class="statistic-list">
      <Statistic v-for="item in data.statisticList.slice(0, 4)" class="item" :is-money="true" :key="item.name"
        :content="item.content" :tip="item.tip" :count="item.count" />
    </div>
    <div class="statistic-list">
      <Statistic v-for="item in data.statisticList.slice(4)" class="item" :is-money="true" :key="item.name"
        :content="item.content" :tip="item.tip" :count="item.count" />
    </div>
  </div>
</template>

<script setup>
import {
  reactive, inject, watch,
} from 'vue';
import Statistic from './components/Statistic.vue';

const global = inject('global');
const props = defineProps({
  statisticData: [],
});

const data = reactive({
  statisticList: [
    {
      content: global.$t('主钱包余额'),
      tip: global.$t('本地钱包余额，不包含转入三方游戏的钱'),
      count: 0,
    },
    {
      content: global.$t('充值'),
      tip: global.$t('下级玩家总存款金额'),
      count: 0,
    },
    {
      content: global.$t('提现'),
      tip: global.$t('下级玩家总取款金额'),
      count: 0,
    },
    {
      content: global.$t('有效投注'),
      tip: global.$t('下级玩家总参与游戏的有效投注额'),
      count: 0,
    },
    {
      content: global.$t('派奖金额'),
      tip: global.$t('下级玩家总有效投注所产生的派奖金额'),
      count: 0,
    },
    {
      content: global.$t('红利金额'),
      tip: global.$t('下级玩家总领取的红利金额'),
      count: 0,
    },
    {
      content: global.$t('平台费'),
      tip: global.$t('三方游戏抽成费用+三方充值抽成费用+平台服务费等'),
      count: 0,
    },
    {
      content: global.$t('纯利'),
      tip: global.$t('即计算代理抽成的最终金额，玩家产生的利润减去红利之后乘以抽成比例得到抽成金额'),
      count: 0,
    },
  ],
});

watch(() => props.statisticData, () => {
  data.statisticList[0].count = props.statisticData.wallet_money;
  data.statisticList[1].count = props.statisticData.deposit;
  data.statisticList[2].count = props.statisticData.withdraw;
  data.statisticList[3].count = props.statisticData.valid_bet;
  data.statisticList[4].count = props.statisticData.win;
  data.statisticList[5].count = props.statisticData.bonus;
  data.statisticList[6].count = props.statisticData.platform_fee;
  data.statisticList[7].count = props.statisticData.profit;
});
</script>

<style lang="scss" scoped>
.statistic-count-wrap {
  margin-top: 20px;
  width: 100%;
  border-radius: 6px;
  padding: 20px 30px;
  box-sizing: border-box;
  border: solid 1px var(--block-border-color);
  background-color: var(--block-bg-color);
}

header {
  font-size: var(--font-size);
  color: var(--font-color-222930);
  margin-bottom: 30px;
  text-align: left;
  font-weight: 600;

  p {
    margin: 0;
    font-size: 14px;
    color: var(--font-color-F84545);
    font-weight: normal;

    i {
      margin-right: 10px;
    }
  }
}

.statistic-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 74.5px;

  &:last-of-type {
    border-top: solid 1px var(--border-color-e2e2e2);
    box-sizing: border-box;

    .item {
      padding-top: 14px;
    }
  }

  .item {
    border-right: solid 1px var(--border-color-e2e2e2);
    box-sizing: border-box;

    &:nth-child(4n) {
      border-right: none;
    }
  }
}
</style>
