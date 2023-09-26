<template>
  <div class="vip-wrap">
    <Swiperlist />
    <!-- <Activity/> -->
    <div class="align-center-wrap">
      <div class="layout-flex-center vip-wrap-title">
        <img src="/src/current_project/assets/images/vip/vipfl.png" :alt="$t('成为VIP')" style="height: 44px;" />
      </div>
      <Level :activityData="activityData" />
      <div class="layout-flex-center vip-wrap-title">
        <img src="/src/current_project/assets/images/vip/vipfl2.png" :alt="$t('VIP福利')" style="height: 54px;" />
      </div>
      <Rebate />
    </div>
    <div class="align-center-wrap">
      <div class="layout-flex-center vip-wrap-title">
        <img src="/src/current_project/assets/images/vip/wxts.png" :alt="$t('VIP福利')" style="height: 45px;" />
      </div>
      <ul class="vip-wrap-question">
        <li v-for="(item,index) in data.questionList" :key="index">
          <div class="num">{{ index }}</div>
          <div class="detail">
            <p class="name" v-if="item.title != ''">{{ item.title }}</p>
            <p class="content">{{ item.content }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { inject, reactive, ref } from 'vue';
import { useRequest } from 'ahooks-vue';
import { activitylist } from '@/api/active';
import Swiperlist from './components/Swiperlist.vue';
import Rebate from './components/Rebate.vue';
import Level from './components/Level.vue';

const subConfig = inject('subConfig');

const global = inject('global');

const { data: activityData } = useRequest(() => activitylist({ type: 10 }), {
  formatResult: (res) => (res.data?.length ? res.data[0]?.benefit_setting ?? [] : []),
});

const data = reactive({
  banner: [],
  activeList: [],
  questionList: [
    {
      title: `${global.$t('晋升标准：')}`,
      content: global.$t('会员的累计有效投注会得到相应的VIP成长值。达到相应级别的要求，即可在次日晋级相应VIP等级，数据统计时间从VIP系统上线当日0点开始。'),
    },
    {
      title: `${global.$t('VIP成长值：')}`,
      content: global.$t('根据不同平台产生的有效流水会获得相应的VP成长值，具体对应数值请查看VIP专题页。'),
    },
    {
      title: `${global.$t('晋升顺序：')}`,
      content: global.$t('VIP成长值达到相应的要求可每天晋升一级，但VIP等级不可越级晋升。'),
    },
    {
      title: `${global.$t('保级要求：')}`,
      content: global.$t('会员在“VIP等级变更”后的30天内，需完成相应等级的有效投注要求方可继续保级30天。'),
    },
    {
      title: `${global.$t('降级标准：')}`,
      content: global.$t('如果会员在30天内没有完成相应的保级要求有效投注，系统会自动降级一个等级，福利也会随之调整至降级后的等级。'),
    },
    {
      title: `${global.$t('晋级礼金：')}`,
      content: global.$t('会员晋升到该级别后可自助领取对应的礼金。礼金需要在发放后30天内领取，过期作废。每个级别的升级礼金代金券每位会员仅能获得1次 (3倍流水即可提款）。'),
    },
    {
      title: `${global.$t('生日礼金：')}`,
      content: global.$t('会员会在生日当天收到礼金，礼金需要在发放后30天内领取，过期作废。以领取当天VIP等级为准，每年可领取一次，如末设置生日则视为自动放弃（3倍流水即可提款）。'),
    },
    {
      title: `${global.$t('每月红包：')}`,
      content: global.$t('会员可在每个自然月的第二天收到每月红包，礼金需要在发放后30天内领取，过期作废。每月红包代金券金额以当月第二天当天VIP等级为准（3倍流水即可提款）。'),
    },
    {
      title: `${global.$t('佳节礼品：')}`,
      content: global.$t('平台会开展相应活动，敬请期待。'),
    },
    {
      title: `${global.$t('客户经理：')}`,
      content: global.$t('您专風的客户经理，7X24小时X365天为您解簽疑问，满足一切合理需求。'),
    },
    {
      title: `${global.$t('游戏通道：')}`,
      content: global.$t('您个人专属的域名和网络线路，更快更稳定，杜绝风险隐患。'),
    },
    {
      title: `${global.$t('有效投注：')}`,
      content: global.$t('相应类型游戏投注，任何对押、和局、无效的、投注失败的、未产生输赢结果的投注不计算为有效投注（体育类港赔0.75欧赔1.75以下的投注、真人类和局投注、电子美内的棋牌游戏如百家乐/21点等的投注、彩票类歡单，棋牌美退回等注单不计算为有效投法）。'),
    },
    {
      title: '',
      content: global.$t(`{0}平台有权对该活动进行修改、暂停，取消等，无需特别通知，井保留对该活动的最终解释权。`, [subConfig.title]),
    },
  ],
});
</script>
<style lang="scss" scoped>
.vip-wrap {
  padding-bottom: 50px;
  min-height: 100vh;

  &-title {
    text-align: center;
    padding: 60px 0 40px;
    position: relative;

    >p {
      font-size: 32px;
      line-height: 45px;
      color: var(--font-color-fff);
      position: relative;
      margin: 0 30px;

      &.right {
        position: absolute;
        right: 0;
        top: 66px;
        font-size: 24px;
        line-height: 33px;
        color: var(--font-color-d5d5d5);
        cursor: pointer;
      }
    }

    >span {
      width: 80px;
      height: 6px;
      background-color: var(--bg-color-2f2f2f);
    }
  }

  &-chart {
    background-color: var(--bg-color-282828);
    margin-top: 60px;
  }

  &-question {
    width: 900px;
    list-style: none;
    padding: 0;
    margin: 0 auto;

    p {
      margin: 0;
    }

    li {
      text-align: left;
      display: flex;
      margin-bottom: 15px;

      >.num {
        display: block;
        width: 20px;
        height: 20px;
        background: var(--theme-color);
        color: var(--font-color-fff);
        border-radius: 100%;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        margin-right: 10px;
      }

      .detail {
        flex: 1;
      }

      .name {
        display: inline-block;
        font-size: 14px;
        line-height: 21px;
        color: var(--font-color-a3a3a3);
      }

      .content {
        font-size: 14px;
        color: var(--font-color-a3a3a3);
        line-height: 20px;
        padding-top: 3px;
      }
    }
  }
}
</style>
