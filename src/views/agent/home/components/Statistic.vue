<template>
  <div class="statistic-wrap">
    <Tooltip :content="content" :tip="tip" placement="top"></Tooltip>
    <div v-if="isMoney" class="statistic-count" v-money="count"></div>
    <div v-else class="statistic-count">{{ count }}</div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import Tooltip from '@/views/agent/components/Tooltip.vue';

const global = inject('global');

defineProps({
  content: {
    type: String,
    required: true,
  },
  tip: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
    default: 0,
  },
  isMoney: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
.statistic-wrap {
  text-align: left;
  width: 142px;
  margin-right: 82px;
}

.statistic-count {
  color: var(--font-color-222930);
  margin-top: 6px;
  font-size: 20px;
  font-weight: 600;
  font-family: moneyFont;
}
</style>
