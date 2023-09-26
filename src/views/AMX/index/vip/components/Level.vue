<template>
  <div class="vip-wrap-rank">
    <ul class="layout-flex-between">
      <li v-for="(item, index) in dicts?.memberlevellist" :key="index" :class="levelActive === index ? 'active' : ''"
        @mouseenter="levelActive = index">
        <img :src="$getSrc(`/src/current_project/assets/images/vip/${index}.png`)" alt />
      </li>
    </ul>
    <div class="vip-recharge-detail">
      <div class="vip-recharge-detail__left">
        <div class="vrd__title">{{ $t('当前存款/流水') }}</div>
        <div class="vrd__deposit">{{ $t('当前存款') }}</div>
        <div class="vrd__quota">{{ allmoney }}</div>
        <div class="vrd__deposit">{{ $t('当前流水') }}</div>
        <div class="vrd__quota">{{ betData?.stat?.valid_bet ?? '0.00' }}</div>
      </div>
      <div class="vip-recharge-detail__right">
        <div class="vrd__title">{{ 'VIP' + levelActive + $t('尊享') }}</div>
        <div class="vrd__deposit">
          <div>{{ $t('每日提款次数') }}</div>
          <div>{{ $t('每日提款额度') }}</div>
          <div>{{ $t('晋级礼金') }}</div>
          <div>{{ $t('生日礼金') }}</div>
          <div>{{ $t('月礼金') }}</div>
          <div>{{ $t('佳节礼品') }}</div>
          <div>{{ $t('最高返水') }}</div>
        </div>
        <div class="vrd__content">
          <div>{{ dicts?.memberlevellist[levelActive]?.withdraw_times_limit ?? '-' }}</div>
          <div>{{ dicts?.memberlevellist[levelActive]?.withdraw_money_limit ?? '-' }}</div>
          <div>{{ activityData[levelActive]?.upgrade_money ?? '-' }}</div>
          <div>{{ activityData[levelActive]?.birthday_money ?? '-' }}</div>
          <div>{{ activityData[levelActive]?.month_money ?? '-' }}</div>
          <div>{{ activityData[levelActive]?.gift ?? '-' }}</div>
          <div>{{ maxBack[levelActive] ? `${maxBack[levelActive]}%` : '-' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  inject, ref, computed, watch,
} from 'vue';
import { useRequest } from 'ahooks-vue';
import { allactivitybenefit } from '@/api/vip';
import { betlog } from '@/api/center';
import { priceFormat } from '@/utils/index';

const props = defineProps({
  activityData: {
    type: Array,
    default: () => [],
  },
});

const maxBack = ref([]);
const $store = inject('store');
$store.dispatch('app/getDict', ['memberlevellist']);
const { app: { dicts }, user } = $store.state;
const isLogin = computed(() => user?.isLogin);
const level = computed(() => user?.userInfo?.level ?? 0);
const levelActive = isLogin.value ? ref(level.value) : ref(0);

const allActivityBenefit = ref([]);

const allmoney = computed(() => {
  const { money = 0, all_platform_money = 0, financing_money = 0 } = user.walletInfo;
  return priceFormat(+money + +all_platform_money + +financing_money);
});

// 从投注记录接口获取有效流水
const { data: betData } = useRequest(
  () => betlog({
    page: 1,
    inte_currency_id: null,
    game_cate_id: 0,
  }),
  {
    manual: false,
  },
);

// const { run: vipRun } = useRequest(allactivitybenefit, {
//   onSuccess(res) {
//     allActivityBenefit.value = res;
//     const temp = [];
//     console.log('aaa', dicts?.memberlevellist);
//     dicts?.memberlevellist?.map((n) => {
//       let max = 0;
//       res.map((m) => {
//         if (m.list[n.level].proportion > max) {
//           max = m.list[n.level].proportion;
//         }
//       });
//       temp.push(max);
//     });
//     maxBack.value = temp;
//   },
// });
watch(() => dicts.memberlevellist, (val) => {
  allactivitybenefit().then((res) => {
    const temp = [];

    val.map((n) => {
      let max = 0;
      res.map((m) => {
        if (m.list[n.level].proportion > max) {
          max = m.list[n.level].proportion;
        }
      });
      temp.push(max);
    });
    maxBack.value = temp;
  });
});

</script>
<style lang="scss" scoped>
.vip-wrap-rank {
  width: 900px;
  margin: 0 auto;

  li {
    width: 66px;
    cursor: pointer;
    transition: 0.3s;

    img {
      width: 66px;
      display: block;
    }

    &:hover,
    &.active {
      transform: scale(1.3);
    }
  }

  .vip-recharge-detail {
    display: flex;
    justify-content: space-between;
    text-align: center;
    margin: 55px 0 20px;

    .vrd__title {
      font-size: 16px;
      height: 39px;
      line-height: 39px;
      color: var(--font-color-fff);
      background: var(--theme-color);
      border-radius: 14px 14px 0px 0px;
    }

    .vrd__deposit {

      &,
      &>div {
        color: var(--theme-color);
        background: var(--bg-color-203858);
        line-height: 39px;

      }
    }

    .vip-recharge-detail__left {
      width: 253px;

      .vrd__quota {
        color: var(--color-white);
        line-height: 39px;
        background: var(--bg-color-063258);
      }

      div:last-child {
        border-radius: 0px 0px 14px 14px;
      }
    }

    .vip-recharge-detail__right {
      width: 625px;
      overflow-x: auto;
      position: relative;

      .vrd__title {
        width: 100%;
        position: sticky;
        left: 0;
      }

      .vrd__content {
        height: 117px;
        line-height: 117px;

        &>div {
          color: var(--color-white);
          background: var(--bg-color-063258);
        }
      }

      .vrd__deposit,
      .vrd__content {
        display: flex;

        div {
          min-width: 20%;
          height: 100%;
        }
      }
    }
  }
}
</style>
