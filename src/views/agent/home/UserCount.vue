
<template>
  <div class="user-count-wrap">
    <header>{{ $t('人数统计') }}</header>
    <div class="statistic-list">
      <Statistic v-for="item in data.statisticList" class="item" :key="item.name" :content="item.content"
        :tip="item.tip" :count="item.count" />
    </div>
  </div>
</template>

<script setup>
import {
  inject, reactive, watch,
} from 'vue';
import Statistic from './components/Statistic.vue';

const global = inject('global');
const props = defineProps({
  statisticData: [],
});
const data = reactive({
  statisticList: [{
    content: global.$t('有效人数'),
    tip: global.$t('注册后存款金额达到100的会员数'),
    count: 0,
  },
  {
    content: global.$t('新增人数'),
    tip: global.$t('日期检索范围内新注册的会员数'),
    count: 0,
  },
  {
    content: global.$t('活跃人数'),
    tip: global.$t('日期检索范围内每日进行游戏投注的会员数'),
    count: 0,
  },
  {
    content: global.$t('总人数'),
    tip: global.$t('即总注册人数'),
    count: 0,
  },
  ],
});

watch(() => props.statisticData, () => {
  data.statisticList = [{
    content: global.$t('有效人数'),
    tip: global.$t('注册后存款金额达到100的会员数'),
    count: props.statisticData.valid_members,
  },
  {
    content: global.$t('新增人数'),
    tip: global.$t('日期检索范围内新注册的会员数'),
    count: props.statisticData.new_members,
  },
  {
    content: global.$t('活跃人数'),
    tip: global.$t('日期检索范围内每日进行游戏投注的会员数'),
    count: props.statisticData.active_members,
  },
  {
    content: global.$t('总人数'),
    tip: global.$t('即总注册人数'),
    count: props.statisticData.total_members,
  },
  ];
});
</script>

<style lang="scss" scoped>
.user-count-wrap {
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
}

.statistic-list {
  display: flex;
  justify-content: space-between;
  height: 50px;

  .item {
    border-right: solid 1px var(--border-color-343434);

    &:last-of-type {
      border-right: none;
    }
  }
}
</style>
