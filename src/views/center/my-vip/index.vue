<template>
  <div class="my-vip-wrap">
    <h2 class="my-vip-wrap-title">{{ $t('VIP等级') }}</h2>
    <div class="layout-flex-center my-vip-wrap-level">
      <span>{{ vipInfo?.level_name }}</span>
      <p>{{ date.upgradeText }}</p>
    </div>
    <div class="layout-flex-center progress-wrap">
      <span>LV{{ vipInfo?.level }}</span>
      <div class="progress-wrap-bar">
        <i class="progress-wrap-bar-inner" :style="{ width: date.progressWidth }" />
      </div>
      <span>LV{{ vipInfo?.level + 1 }}</span>
    </div>
    <h2 class="my-vip-wrap-title">{{ $t('VIP权益') }}</h2>
    <Benefit />
    <h2 class="my-vip-wrap-title">{{ $t('VIP会员晋升') }}</h2>
    <p class="my-vip-wrap-tips">{{ $t('晋级后即可获得相应的晋级礼金，各个洗码优惠也会随着级数增加。') }}</p>
    <p class="my-vip-wrap-tips">{{ $t('升至黄金会员还能享受AA集团为您特别订制的尊荣尊宠豪华游，喜上加喜，让娱乐更加娱乐！') }}</p>
    <div class="my-vip-wrap-benefits" v-loading="vipLoading">
      <ConfigTable :data="date.vipList" :columns="date.vipColumns" :total="0" stripe></ConfigTable>
    </div>
    <el-button class="my-vip-wrap-more" @click="$router.push({ name: 'vip' })">{{ $t('查看更多福利') }}</el-button>
  </div>
</template>

<script setup>
import { inject, reactive, computed } from 'vue';
import { useRequest } from 'ahooks-vue';
import { vipprivilegeinfo } from '@/api/center';
import ConfigTable from '@/components/Table/index.vue';
import vipConfig from '@/views/index/vip/data';
import Benefit from './components/Benefit.vue';

const global = inject('global');
const date = reactive({
  upgradeText: '',
  progressWidth: '',
  vipList: [],
  vipColumns: [],
});
function lessThanOne(num) {
  return num > 1 ? 1 : num;
}
function getUpgradeText(res) {
  const {
    level, next_benefit_money, need_valid_bet, all_benefit_money, all_valid_bet,
  } = res;
  if (level === 0) {
    date.upgradeText = global.$t('存款即可升级为LV1');
    date.progressWidth = '5%';
  } else if (level === 1) {
    date.upgradeText = global.$t('晋级到LV2：还需要有效投注额10w以上');
    date.progressWidth = `${lessThanOne(all_valid_bet / 100000) * 100}%`;
  } else if (level < 10) {
    date.upgradeText = global.$t('晋级到LV');
    date.progressWidth = `${((lessThanOne(all_valid_bet / (need_valid_bet || 1)) + lessThanOne(all_benefit_money / (next_benefit_money || 1))) / 2) * 100}%`;
  } else {
    date.upgradeText = global.$t('已是最高等级');
    date.progressWidth = '100%';
  }
}
function getUpgradeTableData(res) {
  const { level } = res;
  const nextLevel = level + 1;
  const data = [];
  const columns = [];
  vipConfig.forEach((item) => {
    const temp = {
      title: global.$t(item.title),
    };
    temp[`lv${level}`] = item[`lv${level}`];
    temp[`lv${level + 1}`] = item[`lv${level + 1}`];
    data.push(temp);
  });

  date.vipColumns = [
    { prop: 'title', label: global.$t('福利') },
    {
      prop: `lv${level}`, label: global.$t('当前等级'), align: 'center',
    },
    { prop: `lv${nextLevel}`, label: global.$t('晋级后'), align: 'center' },
  ];
  date.vipList = data;
}
const { data: vipInfo, loading: vipLoading } = useRequest(vipprivilegeinfo, {
  onSuccess: (res) => {
    getUpgradeText(res);
    getUpgradeTableData(res);
  },
});

</script>

<style lang="scss" scoped>
.my-vip-wrap {
  text-align: center;
  font-size: 14px;
  color: var(--font-color-999);

  &-title {
    position: relative;
    color: var(--theme-color);
    font-size: 20px;
    font-weight: 500;
    line-height: 50px;
    margin: 0 0 30px;
    text-align: center;

    &::after {
      position: absolute;
      bottom: 0;
      left: 50%;
      content: "";
      width: 44px;
      height: 2px;
      transform: translateX(-50%);
      border-radius: 2px;
      background-color: var(--theme-color);
    }
  }

  &-level {
    span {
      color: var(--theme-color);
      margin-right: 10px;
    }

    p {
      margin: 0;
    }
  }

  .progress-wrap {
    margin: 20px 0 50px;

    > span {
      border-radius: 18px;
      line-height: 20px;
      padding: 0 10px;
      background-color: var(--theme-color);
      color: var(--font-color-333);
      z-index: 2;
    }

    &-bar {
      flex: 1;
      height: 3px;
      border-radius: 3px;
      background-color: var(--border-color-353435);
      position: relative;
      z-index: 1;
      margin: 0 10px;

      &-inner {
        position: relative;
        width: 0;
        height: 100%;
        background-color: var(--theme-color);
        border-radius: 3px;
        transition: all 0.45s ease-out;
        display: block;

        &::after {
          position: absolute;
          top: 50%;
          right: 0;
          content: "";
          width: 8px;
          height: 8px;
          border-radius: 50%;
          transform: translate(50%, -50%);
          background-color: inherit;
        }
      }
    }
  }

  &-tips {
    margin-bottom: 10px;
    line-height: 20px;
  }

  &-more {
    color: var(--font-color-fff);
    margin-bottom: 30px;
  }

  &-benefits {
    border-top: 1px solid var(--border-color-525152);
    min-height: 210px;
    margin: 30px 0 20px;
  }
}
</style>
