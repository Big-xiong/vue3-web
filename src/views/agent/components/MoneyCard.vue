<template>
  <div class="money-wrap">
    <div class="money-header">
      <div class="icon-wrap">
        <svg-icon name="quota"></svg-icon>
      </div>
      <div class="type-text">{{ text }}</div>
    </div>
    <div class="money" v-money="money">{{ money }}</div>
  </div>
</template>

<script setup>

import { inject } from 'vue';

const global = inject('global');

defineProps({
  money: {
    type: Number,
    default: 0,
  },
  text: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss" scoped>
.money-wrap {
  border-radius: 6px;
  padding: 20px 15px;
  border: 1px solid var(--border-color-e2e2e2);
  display: inline-block;

  .money {
    font-size: 20px;
    color: var(--font-color-000);
    font-weight: 600;
    margin-top: 8px;
  }

  .money-header {
    display: flex;
    align-items: center;
    height: 19px;

    .icon-wrap {
      width: 19px;
      height: 19px;
      margin-right: 10px;
      position: relative;

      :deep(.svg-icon) {
        fill: var(--theme-color) !important;
        width: 19px;
        height: 19px;
      }
    }

    .type-text {
      color: var(--font-color-999);
      font-size: 13px;
    }

    .text {
      font-size: 14px;
      color: var(--font-color-949494);
      margin-left: 5px;
    }
  }
}
</style>
